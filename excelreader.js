import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Radio, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';

const ExcelReader = ({ selectedHeaders, setSelectedHeaders }) => {
    const [sheetsData, setSheetsData] = useState({});
    const [headerOptions, setHeaderOptions] = useState([]);
    const [potentialHeaders, setPotentialHeaders] = useState({});
    const [selectedHeaderRow, setSelectedHeaderRow] = useState({});
    const [fileName, setFileName] = useState('');
    const [dragging, setDragging] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const fileInput = useRef(null);

    const readExcel = (file) => {
      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let sheetsDataTemp = {};
        workbook.SheetNames.forEach((sheetName) => {
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
          sheetsDataTemp = { ...sheetsDataTemp, [sheetName]: sheetData };
        });

        setSheetsData(sheetsDataTemp);
        setHeaderOptions(sheetsDataTemp);
        setOpenDialog(true);
      };

      reader.readAsArrayBuffer(file);
    };

    const toggleHeaderSelection = (sheetName, header) => {
      const sheetHeaders = selectedHeaders[fileName]?.[sheetName] || [];
      if (sheetHeaders.includes(header)) {
        setSelectedHeaders(prev => ({
          ...prev,
          [fileName]: {
            ...prev[fileName],
            [sheetName]: prev[fileName][sheetName].filter(h => h !== header)
          }
        }));
      } else {
        setSelectedHeaders(prev => ({
          ...prev,
          [fileName]: {
            ...prev[fileName],
            [sheetName]: [...sheetHeaders, header]
          }
        }));
      }
    };

    const onDragOver = (event) => {
      event.preventDefault();
      setDragging(true);
    };

    const onDragLeave = () => {
      setDragging(false);
    };

    const onDrop = (event) => {
      event.preventDefault();
      if (event.dataTransfer.items && event.dataTransfer.items[0].kind === 'file') {
        readExcel(event.dataTransfer.items[0].getAsFile());
        setDragging(false);
      }
    };

    const onClickUpload = () => {
      if (fileInput.current) {
        fileInput.current.click();
      }
    };

    const handlePotentialHeaderSelection = (sheetName, rowIndex) => {
      setPotentialHeaders(prev => ({
        ...prev,
        [sheetName]: prev[sheetName]?.includes(rowIndex) ? prev[sheetName].filter(i => i !== rowIndex) : [...(prev[sheetName] || []), rowIndex]
      }));
    };

    const handleHeaderSelection = (sheetName, rowIndex) => {
      setSelectedHeaders(prev => ({
        ...prev,
        [fileName]: {
          ...prev[fileName],
          [sheetName]: headerOptions[sheetName][rowIndex]
        }
      }));
      setSelectedHeaderRow(prev => ({
        ...prev,
        [sheetName]: rowIndex
      }));
    };

    return (
      <div>
        <Box className="relative w-full mx-auto my-10">
          <Box className={`border-dashed border-4 border-light-blue-500 w-full h-48 flex items-center justify-center rounded-lg ${dragging ? 'bg-gray-100' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}>
            <input ref={fileInput} type="file" className="opacity-0 position-absolute" style={{ height: '0px', width: '0px'}}
              accept=".xlsx,.xls"
              onChange={(e) => readExcel(e.target.files[0])} />
            <Box className="grid place-items-center">
              <Typography variant="h6" color="textSecondary">Drag and Drop or Click to Upload</Typography>
              <Button variant="contained" color="primary" className="mt-2" onClick={onClickUpload}>
                Select a File
              </Button>
            </Box>
          </Box>
        </Box>

        {Object.keys(sheetsData).map((sheetName, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{sheetName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {selectedHeaders[fileName]?.[sheetName]?.map((header, index) => (
                        <TableCell key={index}>
                          <Checkbox checked={true}
                            onChange={() => toggleHeaderSelection(sheetName, header)} />
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sheetsData[sheetName].slice(selectedHeaderRow[sheetName] + 1 || 0).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Select Header Rows</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {Object.keys(headerOptions).map(sheetName => (
                <Grid item xs={12} sm={6} md={4} key={sheetName}>
                  <Typography variant="h6">{sheetName}</Typography>
                  <List>
                    {headerOptions[sheetName].map((row, rowIndex) => (
                      <ListItem key={rowIndex} dense button onClick={() => handlePotentialHeaderSelection(sheetName, rowIndex)}>
                        <Checkbox
                          checked={potentialHeaders[sheetName]?.includes(rowIndex) || false}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={row.join(' - ')} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            {Object.keys(potentialHeaders).map(sheetName => (
              potentialHeaders[sheetName]?.map(rowIndex => (
                <Button key={rowIndex} onClick={() => handleHeaderSelection(sheetName, rowIndex)}>Use row {rowIndex + 1} in {sheetName} as header</Button>
              ))
            ))}
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};

export default ExcelReader;
