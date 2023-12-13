// export const BASE_URL_PUBLIC = 'https://dev-api.gogtas.com/support/public/api'
// export const BASE_URL = 'https://dev-api.gogtas.com/support/api'
// export const API_VERSION = 'v1'

export const ADMIN_URL = 'https://dev-api.gogtas.com/support/admin/api'

export const API_PATHS = {
  login: 'login',
  organisation: 'organization',
  organisationType: 'organization-type',
  user: 'user',
  ticket:'ticket',
  dashboard:'dashboard',
  template:'template',
  category:'category',
  article:'article',
  folder:'folder',
  offence_user: 'offence-user',
  offenceuser:'offence-user',
  ticketpivot:'ticket-pivot',
  arrestreports:'arrestReports',
  offensecodes:'offense-codes',
  supplementary:'supplementary',
  history:'history',
  location:'location',
  states:'states',
  cities:'cities',
  forgot:'forgot',
  password:'password',
  free_trial_org:'free-trial-org',
  hide_toggle:'hide-toggle',
  editor:'editor',
  file:'file',
  planUpgrade:'planUpgrade',
  license:'license',
  message:"message",
  send:'send',
  zoom:'zoom'

}

export const USER_ROLE = {
  SUPPER_ADMIN: '1',
  ORG_ADMIN: '2',
  AGENT: '3',
  USER: '4'
};

export const FOLDER_VISIBLE_TO = {
  ALL: 1,
  AGENT: 2,
  USER: 3
};


export const TICKET_PRIORITY = {
  URGENT: '1',
  HIGH: '2',
  MEDIUM: '3',
  LOW: '4'

}

export const FILE_TYPE = {
  USER_LOGO: "1",
  ORG_LOGO: "2",
  TICKET_ATTACHMENT: "3",
  ARTICLE_ATTACHMENT: "4",
  KNOWLEDGE_CATEGORY: "5"
}

export const TICKET_STATUS = {
  OPEN: "1",
  PENDING: "2",
  CLOSED: "3",
  WAITING_ON_CUSTOMER: "4",
  WAITING_ON_THIRD_PARTY: "5"
}

export const OFFENCE_TAB_TYPE = {
  Victim:"1",
  Witness:"2",
  Suspect :"3"
 }

export const OFFENCE_OTHERFIELD = {
  TicketFieldId:"2",
  SupplyMentoryReportId:"3"
}

export const RACE_VALUE = {
  AMERICAN_INDIAN_ALASKAN_INDIAN:"American Indian/Alaskan Indian",
  ASIAN_PACIFIC_ISLANDER:"Asian/Pacific Islander",
  BLACK:"Black",
  UNKNOWN:"Unknown",
  WHITE:"White"
}
  export const HAIR_COLOR = {
  BLACK:"Black",
  BLONDE_STRAWBERRY:"Blonde/Strawberry",
  BROWN:"Brown",
  GRAYORPARTIALLYGRAY:"Gray or Partially Gray",
  REDORAUBURN:"Red or Auburn",
  SANDY:"Sandy",
  UNKNOWNORCOMPLETELYBALD:"Unknown or Completely Bald",
  WHITE:"White"
  }
  export const EYE_COLOR = {
  BLACK:"Black",
  BLUE:"Blue",
  BROWN:"Brown",
  GRAY:"Gray",
  GREEN:"Green",
  HAZEL:"Hazel",
  MAROON:"Maroon",
  MULTICOLORED:"Multicolored",
  PINK:"Pink",
  UNKNOWN:"Unknown"

  }
  
  export const SKIN_TONE = {
  ALBINO:"Albino",
  BLACK:"Black",
  DARK:"Dark",
  DARKBROWN:"Dark Brown",
  FAIR:"Fair",
  LIGHT:"Light",
  LIGHTBROWN:"Light Brown",
  MEDIUM:"Medium",
  MEDIUMBROWN:"Medium Brown",
  OLIVE:"Olive",
  RUDDY:"Ruddy",
  SALLOW:"Sallow",
  YELLOW:"Yellow",
  UNKNOWN:"Unknown"
  }

  export const TICKET_PROBLEM_TYPE = {
    INCIDENT :"1",
    PROBLEM:"2",
    REQUEST:"3"
    
  }

  export const TICKET_TYPE = {
    SUPPORT : '1'
  }

  export const KB_ACCESS = {
    NOACCESS : '0',
    SELFANDADMIN : '1',
    SELF : '2',
    ONLYSUPERADMIN : '3'
  }

  export const  CHAT_MESSAGE_TYPE = {
    DEFAULT_MSG: '1'
    };

  export const SOCKET_TICKET_REFRESH = {
    NEW_MESSAGE: '1', 
    NEW_TICKET_CREATED: '6',
    COMMENT_ON_TICKET: '7',
    NEW_TICKET_UPDATED: '8'    
  };
   