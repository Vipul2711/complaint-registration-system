export const initialState = {
  complaints: [],
  allComplaints: [],

  totalElements: 0,
  totalPages: 0,
  page: 0,

  sortBy: "createdAt",
  sortDir: "desc",

  statusFilter: "ALL",
  priorityFilter: "ALL",

  loading: false,

  
  toast: null,
};

export const departmentReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };

    case "SET_DATA":
      return {
        ...state,
        complaints: action.payload.content,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
        loading: false,
      };

    case "SET_ALL_DATA":
      return {
        ...state,
        allComplaints: action.payload,
      };

    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDir: action.payload.sortDir,
        page: 0,
      };

    case "SET_FILTERS":
      return {
        ...state,
        statusFilter: action.payload.status,
        priorityFilter: action.payload.priority,
        page: 0,
      };

    
    case "SHOW_TOAST":
      return {
        ...state,
        toast: action.payload,
      };

    case "HIDE_TOAST":
      return {
        ...state,
        toast: null,
      };

    default:
      return state;
  }
};