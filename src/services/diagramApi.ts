import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(API_CONFIG.PROXY_SERVICE_URL, "/api/v1");

// const mockSystemFlowData = {
//     "nodes": [
//         // Core System
//         { "id": "A", "name": "A", "type": "", "criticality": "Major", "url": "A.json" },
//         // Middleware Systems
//         { "id": "M-P", "name": "M", "type": "", "criticality": "Standard-3", "url": "M.json" },
//         { "id": "M-C", "name": "M", "type": "", "criticality": "Standard-3", "url": "M.json" },
//         { "id": "N-P", "name": "N", "type": "", "criticality": "Standard-3", "url": "N.json" },
//         { "id": "N-C", "name": "N", "type": "", "criticality": "Standard-3", "url": "N.json" },
//         { "id": "O-P", "name": "O", "type": "", "criticality": "Standard-3", "url": "O.json" },
//         { "id": "O-C", "name": "O", "type": "", "criticality": "Standard-3", "url": "O.json" },
//         // External Systems (Producers & Consumers)
//         { "id": "SYS1-P", "name": "SYS1", "type": "", "criticality": "Major", "url": "SYS1.json" },
//         { "id": "SYS1-C", "name": "SYS1", "type": "", "criticality": "Major", "url": "SYS1.json" },
//         { "id": "SYS2-P", "name": "SYS2", "type": "", "criticality": "Standard-1", "url": "SYS2.json" },
//         { "id": "SYS2-C", "name": "SYS2", "type": "", "criticality": "Standard-1", "url": "SYS2.json" },
//         { "id": "SYS3-P", "name": "SYS3", "type": "", "criticality": "Standard-2", "url": "SYS3.json" },
//         { "id": "SYS3-C", "name": "SYS3", "type": "", "criticality": "Standard-2", "url": "SYS3.json" },
//         { "id": "SYS4-P", "name": "SYS4", "type": "", "criticality": "Minor", "url": "SYS4.json" },
//         { "id": "SYS4-C", "name": "SYS4", "type": "", "criticality": "Minor", "url": "SYS4.json" },
//         { "id": "SYS5-P", "name": "SYS5", "type": "", "criticality": "Major", "url": "SYS5.json" },
//         { "id": "SYS5-C", "name": "SYS5", "type": "", "criticality": "Major", "url": "SYS5.json" },
//         { "id": "SYS6-P", "name": "SYS6", "type": "", "criticality": "Standard-1", "url": "SYS6.json" },
//         { "id": "SYS6-C", "name": "SYS6", "type": "", "criticality": "Standard-1", "url": "SYS6.json" },
//         { "id": "SYS7-P", "name": "SYS7", "type": "", "criticality": "Standard-2", "url": "SYS7.json" },
//         { "id": "SYS7-C", "name": "SYS7", "type": "", "criticality": "Standard-2", "url": "SYS7.json" },
//         { "id": "SYS8-P", "name": "SYS8", "type": "", "criticality": "Minor", "url": "SYS8.json" },
//         { "id": "SYS8-C", "name": "SYS8", "type": "", "criticality": "Minor", "url": "SYS8.json" },
//         { "id": "SYS9-P", "name": "SYS9", "type": "", "criticality": "Major", "url": "SYS9.json" },
//         { "id": "SYS9-C", "name": "SYS9", "type": "", "criticality": "Major", "url": "SYS9.json" },
//         { "id": "SYS10-P", "name": "SYS10", "type": "", "criticality": "Standard-1", "url": "SYS10.json" },
//         { "id": "SYS10-C", "name": "SYS10", "type": "", "criticality": "Standard-1", "url": "SYS10.json" },
//         { "id": "SYS11-P", "name": "SYS11", "type": "", "criticality": "Standard-2", "url": "SYS11.json" },
//         { "id": "SYS11-C", "name": "SYS11", "type": "", "criticality": "Standard-2", "url": "SYS11.json" },
//         { "id": "SYS12-P", "name": "SYS12", "type": "", "criticality": "Minor", "url": "SYS12.json" },
//         { "id": "SYS12-C", "name": "SYS12", "type": "", "criticality": "Minor", "url": "SYS12.json" },
//         { "id": "SYS13-P", "name": "SYS13", "type": "", "criticality": "Major", "url": "SYS13.json" },
//         { "id": "SYS13-C", "name": "SYS13", "type": "", "criticality": "Major", "url": "SYS13.json" },
//         { "id": "SYS14-P", "name": "SYS14", "type": "", "criticality": "Standard-1", "url": "SYS14.json" },
//         { "id": "SYS14-C", "name": "SYS14", "type": "", "criticality": "Standard-1", "url": "SYS14.json" },
//         { "id": "SYS15-P", "name": "SYS15", "type": "", "criticality": "Standard-2", "url": "SYS15.json" },
//         { "id": "SYS15-C", "name": "SYS15", "type": "", "criticality": "Standard-2", "url": "SYS15.json" },
//         { "id": "SYS16-P", "name": "SYS16", "type": "", "criticality": "Minor", "url": "SYS16.json" },
//         { "id": "SYS16-C", "name": "SYS16", "type": "", "criticality": "Minor", "url": "SYS16.json" },
//         { "id": "SYS17-P", "name": "SYS17", "type": "", "criticality": "Major", "url": "SYS17.json" },
//         { "id": "SYS17-C", "name": "SYS17", "type": "", "criticality": "Major", "url": "SYS17.json" },
//         { "id": "SYS18-P", "name": "SYS18", "type": "", "criticality": "Standard-1", "url": "SYS18.json" },
//         { "id": "SYS18-C", "name": "SYS18", "type": "", "criticality": "Standard-1", "url": "SYS18.json" },
//         { "id": "SYS19-P", "name": "SYS19", "type": "", "criticality": "Standard-2", "url": "SYS19.json" },
//         { "id": "SYS19-C", "name": "SYS19", "type": "", "criticality": "Standard-2", "url": "SYS19.json" },
//         { "id": "SYS20-P", "name": "SYS20", "type": "", "criticality": "Minor", "url": "SYS20.json" },
//         { "id": "SYS20-C", "name": "SYS20", "type": "", "criticality": "Minor", "url": "SYS20.json" },
//         { "id": "SYS21-P", "name": "SYS21", "type": "", "criticality": "Major", "url": "SYS21.json" },
//         { "id": "SYS21-C", "name": "SYS21", "type": "", "criticality": "Major", "url": "SYS21.json" },
//         { "id": "SYS22-P", "name": "SYS22", "type": "", "criticality": "Standard-1", "url": "SYS22.json" },
//         { "id": "SYS22-C", "name": "SYS22", "type": "", "criticality": "Standard-1", "url": "SYS22.json" },
//         { "id": "SYS23-P", "name": "SYS23", "type": "", "criticality": "Standard-2", "url": "SYS23.json" },
//         { "id": "SYS23-C", "name": "SYS23", "type": "", "criticality": "Standard-2", "url": "SYS23.json" },
//         { "id": "SYS24-P", "name": "SYS24", "type": "", "criticality": "Minor", "url": "SYS24.json" },
//         { "id": "SYS24-C", "name": "SYS24", "type": "", "criticality": "Minor", "url": "SYS24.json" },
//         { "id": "SYS25-P", "name": "SYS25", "type": "", "criticality": "Major", "url": "SYS25.json" },
//         { "id": "SYS25-C", "name": "SYS25", "type": "", "criticality": "Major", "url": "SYS25.json" },
//         { "id": "SYS26-P", "name": "SYS26", "type": "", "criticality": "Standard-1", "url": "SYS26.json" },
//         { "id": "SYS26-C", "name": "SYS26", "type": "", "criticality": "Standard-1", "url": "SYS26.json" },
//         { "id": "SYS27-P", "name": "SYS27", "type": "", "criticality": "Standard-2", "url": "SYS27.json" },
//         { "id": "SYS27-C", "name": "SYS27", "type": "", "criticality": "Standard-2", "url": "SYS27.json" },
//         { "id": "SYS28-P", "name": "SYS28", "type": "", "criticality": "Minor", "url": "SYS28.json" },
//         { "id": "SYS28-C", "name": "SYS28", "type": "", "criticality": "Minor", "url": "SYS28.json" },
//         { "id": "SYS29-P", "name": "SYS29", "type": "", "criticality": "Major", "url": "SYS29.json" },
//         { "id": "SYS29-C", "name": "SYS29", "type": "", "criticality": "Major", "url": "SYS29.json" },
//         { "id": "SYS30-P", "name": "SYS30", "type": "", "criticality": "Standard-1", "url": "SYS30.json" },
//         { "id": "SYS30-C", "name": "SYS30", "type": "", "criticality": "Standard-1", "url": "SYS30.json" }
//     ],
//     "links": [
//     { "source": "A",  "target": "SYS1-P",  "pattern": "API",            "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "SYS2-P",  "pattern": "File Transfer",  "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "SYS3-P",  "pattern": "API",            "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "SYS4-P",  "pattern": "Database Link",  "frequency": "Hourly",    "role": "Producer" },
//     { "source": "A",  "target": "SYS5-P",  "pattern": "File Transfer",  "frequency": "Weekly",    "role": "Producer" },

//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "M-P",     "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer" },

//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },
//     { "source": "A",  "target": "N-P",     "pattern": "API Gateway",   "frequency": "Real-time", "role": "Producer" },

//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },
//     { "source": "A",  "target": "O-P",     "pattern": "ETL",            "frequency": "Daily",     "role": "Producer" },

//     { "source": "M-P", "target": "SYS6-P",  "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },
//     { "source": "M-P", "target": "SYS7-P",  "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },
//     { "source": "M-P", "target": "SYS8-P",  "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },
//     { "source": "M-P", "target": "SYS9-P",  "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },
//     { "source": "M-P", "target": "SYS10-P", "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },
//     { "source": "M-P", "target": "SYS22-P", "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },
//     { "source": "M-P", "target": "SYS27-P", "pattern": "Message Queue","frequency": "Real-time", "role": "Producer" },

//     { "source": "N-P", "target": "SYS11-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },
//     { "source": "N-P", "target": "SYS12-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },
//     { "source": "N-P", "target": "SYS13-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },
//     { "source": "N-P", "target": "SYS14-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },
//     { "source": "N-P", "target": "SYS15-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },
//     { "source": "N-P", "target": "SYS23-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },
//     { "source": "N-P", "target": "SYS28-P", "pattern": "API",           "frequency": "Real-time", "role": "Producer" },

//     { "source": "O-P", "target": "SYS16-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },
//     { "source": "O-P", "target": "SYS17-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },
//     { "source": "O-P", "target": "SYS18-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },
//     { "source": "O-P", "target": "SYS19-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },
//     { "source": "O-P", "target": "SYS20-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },
//     { "source": "O-P", "target": "SYS24-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },
//     { "source": "O-P", "target": "SYS29-P", "pattern": "File Transfer", "frequency": "Daily",     "role": "Producer" },

//     { "source": "A",  "target": "SYS21-P","pattern":"API","frequency":"Real-time","role":"Producer" },
//     { "source": "A",  "target": "SYS25-P","pattern":"Database Link","frequency":"Hourly","role":"Producer" },
//     { "source": "A",  "target": "SYS26-P","pattern":"File Transfer","frequency":"Daily","role":"Producer" },
//     { "source": "A",  "target": "SYS30-P","pattern":"API","frequency":"Real-time","role":"Producer" },

//     { "source": "SYS1-C",  "target": "A",   "pattern": "API",           "frequency": "Real-time", "role": "Consumer" },
//     { "source": "SYS2-C",  "target": "A",   "pattern": "File Transfer", "frequency": "Daily",     "role": "Consumer" },
//     { "source": "SYS3-C",  "target": "A",   "pattern": "API",           "frequency": "Real-time", "role": "Consumer" },
//     { "source": "SYS4-C",  "target": "A",   "pattern": "Database Link", "frequency": "Hourly",    "role": "Consumer" },
//     { "source": "SYS5-C",  "target": "A",   "pattern": "File Transfer", "frequency": "Weekly",    "role": "Consumer" },

//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },
//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },
//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },
//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },
//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },
//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },
//     { "source": "M-C", "target": "A",  "pattern": "Message Queue","frequency": "Real-time","role":"Consumer" },

//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },
//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },
//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },
//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },
//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },
//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },
//     { "source": "N-C", "target": "A",  "pattern": "API Gateway","frequency": "Real-time","role":"Consumer" },

//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "O-C", "target": "A",  "pattern": "ETL","frequency": "Daily","role":"Consumer" },
//     { "source": "SYS6-C","target":"A","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },

//     { "source": "SYS6-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS7-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS8-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS9-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS10-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS22-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS27-C","target":"M-C","pattern":"Message Queue","frequency":"Real-time","role":"Consumer" },

//     { "source": "SYS11-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS12-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS13-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS14-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS15-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS23-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS28-C","target":"N-C","pattern":"API","frequency":"Real-time","role":"Consumer" },

//     { "source": "SYS16-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS17-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS18-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS19-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS20-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS24-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS29-C","target":"O-C","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },

//     { "source": "SYS21-C","target":"A","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS25-C","target":"A","pattern":"Database Link","frequency":"Hourly","role":"Consumer" },
//     { "source": "SYS26-C","target":"A","pattern":"File Transfer","frequency":"Daily","role":"Consumer" },
//     { "source": "SYS30-C","target":"A","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS28-C","target":"A","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS11-C","target":"A","pattern":"API","frequency":"Real-time","role":"Consumer" },
//     { "source": "SYS14-C","target":"A","pattern":"API","frequency":"Real-time","role":"Consumer" }

//   ],
//     "metadata": {
//         "code": "A",
//         "review": "review-code",
//         "integrationMiddleware": ["M-P", "M-C", "N-P", "N-C", "O-P", "O-C"],
//         "generatedDate": "2025-07-25"
//     }
// };
const mockSystemFlowData = {
  nodes: [
    {
      id: "sys-001",
      name: "NextGen Platform",
      type: "Core System",
      criticality: "Major",
      url: "sys-001.json",
    },
    {
      id: "sys-002-P",
      name: "Test2",
      type: "IncomeSystem",
      criticality: "Major",
      url: "sys-002.json",
    },
    {
      id: "OSB-P",
      name: "OSB",
      type: "Middleware",
      criticality: "Standard-2",
      url: "OSB.json",
    },
    {
      id: "sys-003-C",
      name: "Test3",
      type: "IncomeSystem",
      criticality: "Major",
      url: "sys-003.json",
    },
    {
      id: "OSB-C",
      name: "OSB",
      type: "Middleware",
      criticality: "Standard-2",
      url: "OSB.json",
    },
    {
      id: "sys-004-P",
      name: "Test4",
      type: "IncomeSystem",
      criticality: "Major",
      url: "sys-004.json",
    },
    {
      id: "sys-005-P",
      name: "Test5",
      type: "IncomeSystem",
      criticality: "Major",
      url: "sys-005.json",
    },
    {
      id: "sys-005-C",
      name: "Test5",
      type: "IncomeSystem",
      criticality: "Major",
      url: "sys-005.json",
    },
    {
      id: "API_GATEWAY-P",
      name: "API_GATEWAY",
      type: "Middleware",
      criticality: "Standard-2",
      url: "API_GATEWAY.json",
    },
    {
      id: "sys-002-C",
      name: "Test2",
      type: "IncomeSystem",
      criticality: "Major",
      url: "sys-002.json",
    },
    {
      id: "API_GATEWAY-C",
      name: "API_GATEWAY",
      type: "Middleware",
      criticality: "Standard-2",
      url: "API_GATEWAY.json",
    },
    {
      id: "external-C",
      name: "external",
      type: "External",
      criticality: "Major",
      url: "external.json",
    },
  ],
  links: [
    {
      source: "sys-002-P",
      target: "OSB-P",
      pattern: "API",
      frequency: "DAILY",
      role: "Producer",
    },
    {
      source: "OSB-P",
      target: "sys-001",
      pattern: "API",
      frequency: "DAILY",
      role: "Consumer",
    },
    {
      source: "sys-001",
      target: "OSB-C",
      pattern: "API",
      frequency: "DAILY",
      role: "Producer",
    },
    {
      source: "OSB-C",
      target: "sys-003-C",
      pattern: "API",
      frequency: "DAILY",
      role: "Consumer",
    },
    {
      source: "sys-004-P",
      target: "sys-001",
      pattern: "API",
      frequency: "DAILY",
      role: "CONSUMER",
    },
    {
      source: "sys-005-P",
      target: "OSB-P",
      pattern: "API",
      frequency: "DAILY",
      role: "Producer",
    },
    {
      source: "OSB-P",
      target: "sys-001",
      pattern: "API",
      frequency: "DAILY",
      role: "Consumer",
    },
    {
      source: "sys-001",
      target: "OSB-C",
      pattern: "BATCH",
      frequency: "DAILY",
      role: "Producer",
    },
    {
      source: "OSB-C",
      target: "sys-005-C",
      pattern: "BATCH",
      frequency: "DAILY",
      role: "Consumer",
    },
    {
      source: "sys-005-P",
      target: "API_GATEWAY-P",
      pattern: "BATCH",
      frequency: "WEEKLY",
      role: "Producer",
    },
    {
      source: "API_GATEWAY-P",
      target: "sys-001",
      pattern: "BATCH",
      frequency: "WEEKLY",
      role: "Consumer",
    },
    {
      source: "sys-001",
      target: "sys-005-C",
      pattern: "FILE",
      frequency: "WEEKLY",
      role: "PRODUCER",
    },
    {
      source: "sys-001",
      target: "API_GATEWAY-C",
      pattern: "API",
      frequency: "DAILY",
      role: "Producer",
    },
    {
      source: "API_GATEWAY-C",
      target: "sys-002-C",
      pattern: "API",
      frequency: "DAILY",
      role: "Consumer",
    },
    {
      source: "sys-001",
      target: "OSB-C",
      pattern: "EVENT",
      frequency: "WEEKLY",
      role: "Producer",
    },
    {
      source: "OSB-C",
      target: "external-C",
      pattern: "EVENT",
      frequency: "WEEKLY",
      role: "Consumer",
    },
  ],
  metadata: {
    code: "sys-001",
    review: "AWG-2025-001",
    integrationMiddleware: ["OSB-P", "OSB-C", "API_GATEWAY-P", "API_GATEWAY-C"],
    generatedDate: "2025-09-30",
  },
};

// {
//     "nodes": [
//         // Core System
//         { "id": "A", "name": "System A", "type": "Core System", "criticality": "Major", "url": "A.json" },

//         // Middleware Systems (reduced from 6 to 4)
//         { "id": "M-P", "name": "Message Queue", "type": "Middleware", "criticality": "Standard-2", "url": "M.json" },
//         { "id": "M-C", "name": "Message Queue", "type": "Middleware", "criticality": "Standard-2", "url": "M.json" },
//         { "id": "N-P", "name": "API Gateway", "type": "Middleware", "criticality": "Standard-2", "url": "N.json" },
//         { "id": "N-C", "name": "API Gateway", "type": "Middleware", "criticality": "Standard-2", "url": "N.json" },

//         // External Systems (reduced from 60 to 20)
//         { "id": "SYS1-P", "name": "Payment System", "type": "External", "criticality": "Major", "url": "SYS1.json" },
//         { "id": "SYS1-C", "name": "Payment System", "type": "External", "criticality": "Major", "url": "SYS1.json" },
//         { "id": "SYS3-C", "name": "Notification Service", "type": "External", "criticality": "Standard-2", "url": "SYS3.json" },
//         { "id": "SYS5-P", "name": "Audit System", "type": "External", "criticality": "Standard-1", "url": "SYS5.json" },
//         { "id": "SYS5-C", "name": "Audit System", "type": "External", "criticality": "Standard-1", "url": "SYS5.json" },
//         { "id": "SYS6-P", "name": "Inventory System", "type": "External", "criticality": "Major", "url": "SYS6.json" },
//         { "id": "SYS7-P", "name": "Reporting Service", "type": "External", "criticality": "Standard-2", "url": "SYS7.json" },
//         { "id": "SYS7-C", "name": "Reporting Service", "type": "External", "criticality": "Standard-2", "url": "SYS7.json" },
//         { "id": "SYS8-C", "name": "Email Service", "type": "External", "criticality": "Minor", "url": "SYS8.json" }
//     ],
//     "links": [
//         // Direct connections from A to external systems (8 connections)
//         { "source": "A", "target": "SYS1-P", "pattern": "API", "frequency": "Real-time", "role": "Producer", "description": "Payment processing" },

//         // Connections through Message Queue middleware (4 connections)
//         { "source": "A", "target": "M-P", "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer", "description": "Queue messages" },
//         { "source": "A", "target": "M-P", "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer", "description": "Queue messages" },
//         { "source": "M-P", "target": "SYS5-P", "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer", "description": "Audit events" },
//         { "source": "M-P", "target": "SYS6-P", "pattern": "Message Queue", "frequency": "Real-time", "role": "Producer", "description": "Inventory updates" },

//         // Connections through API Gateway middleware (2 connections)
//         { "source": "A", "target": "N-P", "pattern": "API Gateway", "frequency": "Real-time", "role": "Producer", "description": "API routing" },
//         { "source": "N-P", "target": "SYS7-P", "pattern": "API", "frequency": "Real-time", "role": "Producer", "description": "Report generation" },

//         // Consumer connections back to A (8 connections)
//         { "source": "SYS1-C", "target": "A", "pattern": "API", "frequency": "Real-time", "role": "Consumer", "description": "Payment confirmations" },
//         { "source": "SYS8-C", "target": "A", "pattern": "File", "frequency": "Daily", "role": "Consumer", "description": "Email reports" },

//         // Consumer connections through middleware (6 connections)
//         { "source": "SYS3-C", "target": "M-C", "pattern": "Message Queue", "frequency": "Real-time", "role": "Consumer", "description": "Status updates" },
//         { "source": "SYS5-C", "target": "M-C", "pattern": "Message Queue", "frequency": "Real-time", "role": "Consumer", "description": "Audit responses" },
//         { "source": "M-C", "target": "A", "pattern": "Message Queue", "frequency": "Real-time", "role": "Consumer", "description": "Middleware responses" },
//         { "source": "M-C", "target": "A", "pattern": "Message Queue", "frequency": "Real-time", "role": "Consumer", "description": "Middleware responses" },

//         { "source": "SYS7-C", "target": "N-C", "pattern": "API", "frequency": "Real-time", "role": "Consumer", "description": "Report status" },
//         { "source": "N-C", "target": "A", "pattern": "API Gateway", "frequency": "Real-time", "role": "Consumer", "description": "Gateway responses" },
//     ],
//     "metadata": {
//         "code": "A",
//         "review": "System Integration Review",
//         "integrationMiddleware": ["M-P", "M-C", "N-P", "N-C"],
//         "generatedDate": "2025-01-02"
//     }
// };

/*
{
  "nodes": [
    {
      "id": "A",
      "name": "A",
      "type": "",
      "criticality": "Major",
      "url": "A.json"
    }
  ],
  "links": [
    {
      "source": "A",
      "target": "SYS1-P",
      "pattern": "API",
      "frequency": "Real-time",
      "role": "Producer"
    }
  ],
  "metadata": {
    "code": "A",
    "review": "review-code",
    "integrationMiddleware": [
      "M-P",
      "M-C",
      "N-P",
      "N-C",
      "O-P",
      "O-C"
    ],
    "generatedDate": "2025-07-25"
  }
}
*/

export const getSystemFlowAPI = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/diagram/system-dependencies/${systemCode}`
  );
  return response.data;
  // return mockSystemFlowData;
};

export const getOverallSystemsFlowAPI = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/diagram/system-dependencies/all`
  );
  return response.data;
  //   return mockSystemFlowData;
};

export const getSystemPaths = async (
  producerSystemCode: string,
  consumerSystemCode: string
) => {
  const response = await axios.get(
    `${API_BASE_URL}/diagram/system-dependencies/path?start=${producerSystemCode}&end=${consumerSystemCode}`
  );
  return response.data;
};

const mockBCData = {
  capabilities: [
    {
      id: "l1-unknown1",
      name: "UNKNOWN1",
      level: "L1",
      parentId: null,
      systemCount: 1,
    },
    {
      id: "l1-unknown2",
      name: "UNKNOWN2",
      level: "L1",
      parentId: null,
      systemCount: 1,
    },
    {
      id: "l2-unknown1",
      name: "UNKNOWN1",
      level: "L2",
      parentId: "l1-unknown1",
      systemCount: 1,
    },
    {
      id: "l2-unknown2",
      name: "UNKNOWN2",
      level: "L2",
      parentId: "l1-unknown1",
      systemCount: 1,
    },
    {
      id: "l2-unknown3",
      name: "UNKNOWN3",
      level: "L2",
      parentId: "l1-unknown2",
      systemCount: 1,
    },
    {
      id: "l2-unknown4",
      name: "UNKNOWN4",
      level: "L2",
      parentId: "l1-unknown2",
      systemCount: 1,
    },
    {
      id: "l3-unknown1",
      name: "UNKNOWN1",
      level: "L3",
      parentId: "l2-unknown1",
      systemCount: 9,
    },
    {
      id: "l3-unknown2",
      name: "UNKNOWN2",
      level: "L3",
      parentId: "l2-unknown1",
      systemCount: 9,
    },
    {
      id: "l3-unknown3",
      name: "UNKNOWN3",
      level: "L3",
      parentId: "l2-unknown2",
      systemCount: 9,
    },
    {
      id: "l3-unknown4",
      name: "UNKNOWN4",
      level: "L3",
      parentId: "l2-unknown2",
      systemCount: 9,
    },
    {
      id: "sys-002",
      name: "Test2",
      level: "System",
      parentId: "l3-unknown1",
      systemCount: null,
    },
    {
      id: "sys-003",
      name: "Test3",
      level: "System",
      parentId: "l3-unknown1",
      systemCount: null,
    },
    {
      id: "sys-004",
      name: "Test4",
      level: "System",
      parentId: "l3-unknown2",
      systemCount: null,
    },
    {
      id: "sys-005",
      name: "Test5",
      level: "System",
      parentId: "l3-unknown2",
      systemCount: null,
    },
    {
      id: "sys-001",
      name: "NextGen Platform",
      level: "System",
      parentId: "l3-unknown3",
      systemCount: null,
    },
    {
      id: "sys-006",
      name: "Test6",
      level: "System",
      parentId: "l3-unknown3",
      systemCount: null,
    },
    {
      id: "sys-007",
      name: "Test7",
      level: "System",
      parentId: "l3-unknown4",
      systemCount: null,
    },
    {
      id: "sys-008",
      name: "Test8",
      level: "System",
      parentId: "l3-unknown4",
      systemCount: null,
    },
    {
      id: "sys-009",
      name: "Solution9",
      level: "System",
      parentId: "l3-unknown1",
      systemCount: null,
    },
  ],
};

export const getBusinessCapabilities = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/diagram/business-capabilities/all`
  );
  return response.data;
  // return mockBCData;
};

export const getSystemBusinessCapabilities = async (systemCode: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/diagram/business-capabilities/${systemCode}`
  );
  return response.data;
};
