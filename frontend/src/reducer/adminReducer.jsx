export const initialState = {
  complaints: [],
  departments: [],
  stats: {},
  totalPages: 0,
  loading: false,
  error: null,
};

export const adminReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };

    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_COMPLAINTS":
  return {
    ...state,
    loading: false,
    complaints: action.payload.content,
    totalPages: action.payload.totalPages,
    totalElements: action.payload.totalElements, // ✅ ADD THIS
  };

    case "SET_DEPARTMENTS":
      return {
        ...state,
        departments: action.payload,
      };

    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
      };

    case "UPDATE_COMPLAINT":
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    default:
      return state;
  }
};