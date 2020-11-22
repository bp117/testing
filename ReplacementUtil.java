import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.File;
import java.io.IOException;
import java.util.*;

public class ReplacementUtil {

    public static void main(String args[]) {
      	String valueStr ="sys_date=1140217,account_number=000000011258029,today_amt_wd=+00000000000.00,today_amt_ret_dep=+00000000000.00,next_bus_day_amt_wd=+00000000000.00,coll_bal_after_post=-00000000500.00,ach_stop_company_id=,is_item_ret=,original_trans_amt=00000000000.00,cycle_todate_float_balance=+00000000000.00,effective_date=1131231,today_amt_dep=+00000000000.00,is_returnable=,message_root_element=MSG001,transaction_code=05685,trace_id=R6045,is_check_image=,creation_timestamp=20140217143435025807,transaction_num=0000000001,next_bus_day_amt_dep=+00000000000.00,avail_bal_after_post=-00000000500.00,,matched_reversal_flag=N,next_bus_day_amt_ret_dep=+00000000000.00,transaction_description=ONLINE_TRANSFER,version=05,debit_credit_code=D,hogan_prod_code=DDA,company_number=00808,intraday_sequence_number=000000000000033,post_date=11321231,balance_amount=+00000000500.00,transaction_category=,display_avail_bal_amt=+00000000500.00,realtime_memo_flag=R,long_collected_balance=+00000000500.00,amt_of_restraints=+00000000000.00";
    	String jsonStr = "[{\"xPath\":\"/MSG001/SYSTEMINFO\",\"fields\":[{\"name\":\"creation_timestamp\",\"startPos\":\"37\",\"endPos\":\"57\",\"type\":\"java.lang.String\"},{\"name\":\"version\",\"startPos\":\"6\",\"endPos\":\"8\",\"type\":\"java.lang.Integer\"}]},{\"xPath\":\"/MSG001/PARENT\",\"fields\":[]},{\"xPath\":\"/MSG001/DGDETAIL\",\"fields\":[{\"name\":\"account_number\",\"startPos\":\"27\",\"endPos\":\"42\",\"type\":\"java.lang.String\"},{\"name\":\"hogan_prod_code\",\"startPos\":\"42\",\"endPos\":\"45\",\"type\":\"java.lang.String\"},{\"name\":\"company_number\",\"startPos\":\"14\",\"endPos\":\"19\",\"type\":\"java.lang.Integer\"},{\"name\":\"intraday_sequence_number\",\"startPos\":\"46\",\"endPos\":\"61\",\"type\":\"java.lang.Long\"},{\"name\":\"avail_bal_after_post\",\"startPos\":\"570\",\"endPos\":\"585\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"realtime_memo_flag\",\"startPos\":\"45\",\"endPos\":\"46\",\"type\":\"java.lang.String\"},{\"name\":\"post_date\",\"startPos\":\"69\",\"endPos\":\"76\",\"type\":\"java.lang.String\"},{\"name\":\"effective_date\",\"startPos\":\"76\",\"endPos\":\"83\",\"type\":\"java.lang.String\"},{\"name\":\"trace_id\",\"startPos\":\"104\",\"endPos\":\"124\",\"type\":\"java.lang.String\"},{\"name\":\"transaction_num\",\"startPos\":\"124\",\"endPos\":\"134\",\"type\":\"java.lang.String\"},{\"name\":\"transaction_code\",\"startPos\":\"134\",\"endPos\":\"139\",\"type\":\"java.lang.String\"},{\"name\":\"debit_credit_code\",\"startPos\":\"139\",\"endPos\":\"140\",\"type\":\"java.lang.String\"},{\"name\":\"transaction_description\",\"startPos\":\"151\",\"endPos\":\"323\",\"type\":\"java.lang.String\"},{\"name\":\"sys_date\",\"startPos\":\"332\",\"endPos\":\"339\",\"type\":\"java.lang.String\"},{\"name\":\"is_check_image\",\"startPos\":\"414\",\"endPos\":\"415\",\"type\":\"java.lang.String\"},{\"name\":\"is_item_ret\",\"startPos\":\"415\",\"endPos\":\"416\",\"type\":\"java.lang.String\"},{\"name\":\"transaction_category\",\"startPos\":\"416\",\"endPos\":\"419\",\"type\":\"java.lang.String\"},{\"name\":\"original_trans_amt\",\"startPos\":\"688\",\"endPos\":\"702\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"is_returnable\",\"startPos\":\"729\",\"endPos\":\"730\",\"type\":\"java.lang.String\"},{\"name\":\"matched_reversal_flag\",\"startPos\":\"323\",\"endPos\":\"324\",\"type\":\"java.lang.String\"},{\"name\":\"today_amt_dep\",\"startPos\":\"450\",\"endPos\":\"465\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"next_bus_day_amt_dep\",\"startPos\":\"495\",\"endPos\":\"510\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"today_amt_wd\",\"startPos\":\"465\",\"endPos\":\"480\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"next_bus_day_amt_wd\",\"startPos\":\"510\",\"endPos\":\"525\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"coll_bal_after_post\",\"startPos\":\"555\",\"endPos\":\"570\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"long_collected_balance\",\"startPos\":\"615\",\"endPos\":\"630\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"cycle_to_date_float_balance\",\"startPos\":\"600\",\"endPos\":\"615\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"amt_of_restraints\",\"startPos\":\"585\",\"endPos\":\"600\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"today_amt_ret_dep\",\"startPos\":\"480\",\"endPos\":\"495\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"next_bus_day_amt_ret_dep\",\"startPos\":\"525\",\"endPos\":\"540\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"display_avail_bal_amt\",\"startPos\":\"702\",\"endPos\":\"717\",\"type\":\"java.lang.BigDecimal\"},{\"name\":\"ach_shop_company_id\",\"startPos\":\"425\",\"endPos\":\"435\",\"type\":\"java.lang.String\"}]}]";
    	try{
    	    updateXMLFile(valueStr, jsonStr, "");    
    	}catch(Exception e){
    	    System.out.println("Unexpected Error occurred in updating XML File.");
    	}
		
    }
    
    public static void updateXMLFile(String variableString, String json, String xmlFilePath) throws SAXException, TransformerException, ParserConfigurationException, XPathExpressionException, IOException {

        Map<String, String> valueMap = getVariableValueMapFromString(variableString);

        if (valueMap.size() == 0) {
            System.out.println("No values processed. Thus returning without any processing");
            return;
        }

        JsonNode[] jsonNodes = null;
        try {
            jsonNodes = getJsonNodesFromString(json);
        } catch (Exception e) {
            System.out.println("Invalid Json found thus returning without processing");
            return;
        }

        if (jsonNodes != null) {
            if(StringUtils.isNotBlank(xmlFilePath))
                replaceInXml(jsonNodes, xmlFilePath, valueMap);
            else
                generateNewXml(jsonNodes, valueMap);
        }

    }

    public static void generateNewXml(JsonNode[] jsonNodes, Map<String, String> valueMap) throws ParserConfigurationException, XPathExpressionException, TransformerException, IOException, SAXException {
        String fileName = "outputXML.xml";
        Boolean fileCreated = false;
        for (JsonNode jsonNode : jsonNodes) {

            for (NodeFields nodeFields : jsonNode.fields) {

                DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
                DocumentBuilder db = dbf.newDocumentBuilder();
                Document document = fileCreated?db.parse(new File(fileName)):db.newDocument();


                XPathFactory xpf = XPathFactory.newInstance();
                XPath xpath = xpf.newXPath();

                Node node = getRequiredNode(xpath, jsonNode, document);
                String textContent = node.getTextContent();

                try {
                    String newContent = getNewContent(textContent, nodeFields, valueMap);
                    node.setTextContent(newContent);
                } catch (Exception e) {
                    System.out.println("Not able to generate new string, thus skipping");
                    continue;
                }

                // Write changes to a file
                Transformer transformer = TransformerFactory.newInstance().newTransformer();
                transformer.transform(new DOMSource(document), new StreamResult(new File(fileName)));
                fileCreated=true;
            }

        }
    }

    public static Node getRequiredNode(XPath xpath, JsonNode jsonNode, Document document) throws XPathExpressionException {
        Node node = (Node) xpath.evaluate(jsonNode.xPath, document,
                XPathConstants.NODE);

        if(node!=null){
            return node;
        }


        String currXPath = jsonNode.xPath;
        Stack<String> stack = new Stack<>();
        while(node==null&& StringUtils.isNotEmpty(currXPath)){
            int lastIndexOfSlash = currXPath.lastIndexOf('/');
            String lastLevel = currXPath.substring(lastIndexOfSlash+1);
            stack.push(lastLevel);
            currXPath=currXPath.substring(0,lastIndexOfSlash);
            if(StringUtils.isNotBlank(currXPath)){
                node = (Node) xpath.evaluate(currXPath, document,
                        XPathConstants.NODE);
            }
        }

        if(StringUtils.isNotEmpty(currXPath)){
            while(!stack.empty()){
                Element element = document.createElement(stack.pop());
                node.appendChild(element);
                node=element;
            }
        }else{
            Element rootElement = document.createElement(stack.pop());
            document.appendChild(rootElement);
            node=rootElement;
            while(!stack.empty()){
                Element element = document.createElement(stack.pop());
                node.appendChild(element);
                node=element;
            }
        }

        return node;
    }

    public static void replaceInXml(JsonNode[] jsonNodes, String xmlFilePath, Map<String, String> valueMap) throws IOException, SAXException, ParserConfigurationException, XPathExpressionException, TransformerException {
        for (JsonNode jsonNode : jsonNodes) {

            for (NodeFields nodeFields : jsonNode.fields) {

                DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
                DocumentBuilder db = dbf.newDocumentBuilder();

                Document document=null;
                try{
                    document = db.parse(new File(xmlFilePath));
                }catch (Exception e){
                    System.out.println("Invalid xml received. Exiting!!!!");
                }


                XPathFactory xpf = XPathFactory.newInstance();
                XPath xpath = xpf.newXPath();
                Node node = (Node) xpath.evaluate(jsonNode.xPath, document,
                        XPathConstants.NODE);
                String textContent = node.getTextContent();

                try {
                    String newContent = getNewContent(textContent, nodeFields, valueMap);
                    node.setTextContent(newContent);
                } catch (Exception e) {
                    System.out.println("Not able to generate new string, thus skipping");
                    continue;
                }

                // Write changes to a file
                Transformer transformer = TransformerFactory.newInstance().newTransformer();
                transformer.transform(new DOMSource(document), new StreamResult(new File(xmlFilePath)));
            }

        }

    }

    public static String getNewContent(String textContent, NodeFields nodeFields, Map<String, String> valueMap) {
        if(StringUtils.isBlank(textContent)){
            StringBuilder sb = new StringBuilder();
            for(int i=0; i<nodeFields.endPos;i++){
                sb.append("#");
            }
            textContent=sb.toString();
        }

        String substring1 = nodeFields.startPos==0?"":textContent.substring(0, nodeFields.startPos);
        String substring2 = textContent.substring(nodeFields.endPos);
        return substring1 + valueMap.get(nodeFields.name) + substring2;
    }

    public static JsonNode[] getJsonNodesFromString(String json) {
        if (StringUtils.isEmpty(json))
            return null;
        Gson gson = new Gson();
        JsonNode[] jsonNodes = gson.fromJson(json, JsonNode[].class);
        return jsonNodes;
    }

    public static Map<String, String> getVariableValueMapFromString(String values) {
        if (StringUtils.isEmpty(values)) {
            return Collections.emptyMap();
        }

        Map<String, String> valueMap = new HashMap<>();

        String[] splitVariables = values.split(",");

        for (String variableStr : splitVariables) {
            String[] equalSplit = variableStr.split("=");
            if (equalSplit.length == 2) {
                valueMap.put(equalSplit[0], equalSplit[1]);
            }
        }

        return valueMap;
    }

    public class JsonNode {
        String xPath;
        List<NodeFields> fields;
    }

    public class NodeFields {
        String name;
        Integer startPos;
        Integer endPos;
        String type;
    }
}