const BASE_URL = "http://localhost:8080"
export const UPLOAD_COMPONENT_DEFINITION_URL =`${BASE_URL}/upload`; 
export const COMPONENT_DEFINITION_DATA_URL =`${BASE_URL}/getdata`; 
export const DELETE_COMPONENT_DEFINITION_DATA_URL =`${BASE_URL}/tablerow/delete/{id}`; 
export const UPDATE_COMPONENT_DEFINITION_DATA_URL =`${BASE_URL}/tablerow/updatedata`; 
export const SUBMIT_EXPERIMENT_JSON_URL =`${BASE_URL}/insertexperimentdata`; 
export const SUBMIT_FINAL_EXPERIMENT_JSON_URL =`${BASE_URL}/insertfinalexperimentdata`; 
export const DELETE_FINAL_EXPERIMENT_JSON_URL =`${BASE_URL}/deletefinalexperimentdata`; 
export const LOAD_EXPERIMENT_JSON_URL =`${BASE_URL}/getexperiments`; 
export const LOAD_FINAL_EXPERIMENT_JSON_URL =`${BASE_URL}/getfinalexperimentdata`; 
export const SUBMIT_COMP_DEPENDENCY_URL =`${BASE_URL}/insertmodifydata`; 

export const UPLOAD_ENVIRONMENT_CONFIG_URL =`${BASE_URL}/upload`; 
export const ENVIRONMENT_CONFIG_DATA_URL =`${BASE_URL}/getdata`; 
export const DELETE_ENVIRONMENT_CONFIG_DATA_URL =`${BASE_URL}/tablerow/delete/{id}`; 
export const UPDATE_ENVIRONMENT_CONFIG_DATA_URL =`${BASE_URL}/tablerow/updatedata`; 

export const START_EXPERIMENT_URL = `${BASE_URL}/experiment/runChaosTest`
export const EXPERIMENT_STATUS_URL = `${BASE_URL}/experiment/getStatus`
export const EXPERIMENT_RUN_HISTORY_URL = `${BASE_URL}/experiment/history`
export const DELETE_EXPERIMENT_RUN_URL = `${BASE_URL}/experiment/delete`

// export const START_EXPERIMENT_URL = "http://localhost:4001/runChaosTest"
// export const EXPERIMENT_STATUS_URL = "http://localhost:4001/getStatus"