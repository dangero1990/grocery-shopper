import { createContext, useContext, useReducer } from "react";

// Types

export interface Ingredient {
    id: string;
    name: string;
    category: string;
    quantity: number;
}

export interface Meal {
    id: string;
    name: string;
    dayOfWeek: string;
}

export interface GlobalState {
    ingredients: Ingredient[];
    meals: Meal[];
}

// Actions
type Action =
    | { type: 'ADD_INGREDIENT'; payload: Ingredient }
    | { type: 'REMOVE_INGREDIENT'; payload: { id: string } }
    | { type: 'UPDATE_INGREDIENT'; payload: Ingredient }
    | { type: 'ADD_MEAL'; payload: Meal }
    | { type: 'REMOVE_MEAL'; payload: { id: string } }
    | { type: 'UPDATE_MEAL'; payload: Meal };

// Initial State

const initialState: GlobalState = {
    ingredients: [],
    meals: []
}

// Reducer
const globalReducer = (state: GlobalState, action: Action): GlobalState => {
    switch (action.type) {
        case 'ADD_INGREDIENT':
            return { ...state, ingredients: [...state.ingredients, action.payload] };
        case 'REMOVE_INGREDIENT':
            return { ...state, ingredients: state.ingredients.filter(ing => ing.id !== action.payload.id) };
        case 'UPDATE_INGREDIENT':
            return {
                ...state,
                ingredients: state.ingredients.map(ing => ing.id === action.payload.id ? action.payload : ing)
            };
        case 'ADD_MEAL':
            return { ...state, meals: [...state.meals, action.payload] };
        case 'REMOVE_MEAL':
            return { ...state, meals: state.meals.filter(meal => meal.id !== action.payload.id) };
        case 'UPDATE_MEAL':
            return {
                ...state,
                meals: state.meals.map(meal => meal.id === action.payload.id ? action.payload : meal)
            };
        default:
            return state;
    }
}

// Context Creation

type GlobalContextValue = {
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
};

const GlobalContext = createContext<GlobalContextValue | null>(null);

// Provider

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(globalReducer, initialState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
}

// Hook

export function useGlobalState(): GlobalContextValue {
  const ctx = useContext(GlobalContext);
  
  if (!ctx) throw new Error("useGlobalState must be used within a GlobalProvider");
  
  return ctx;
}