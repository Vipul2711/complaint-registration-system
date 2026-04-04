export const initialState = {
  complaints: [],
  totalPages: 0,
  totalElements: 0,
  page: 0,

  sortBy: "createdAt",
  sortDir: "desc",
  statusFilter: "ALL",

  loading: false,
  error: null,
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        complaints: action.payload.content,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
      };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDir: action.payload.sortDir,
        page: 0,
      };

    case "SET_FILTER":
      return {
        ...state,
        statusFilter: action.payload,
        page: 0,
      };

    default:
      return state;
  }
};