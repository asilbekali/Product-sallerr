// reducer.ts
import type { Product } from "../types/types";

interface State {
    orderList: Product[];
}

const initialState: State = {
    orderList: [],
};

export const reducer = (state = initialState, action: any): State => {
    switch (action.type) {
        case "get":
            return { ...state, orderList: action.payload };

        case "add":
            return { ...state, orderList: [...state.orderList, action.payload] };

        case 'delete':
            return {
                ...state,
                orderList: state.orderList.filter(
                    product => Number(product.id) !== Number(action.payload)
                )
            };


        case "update":
            return {
                ...state,
                orderList: state.orderList.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
            };

        default:
            return state;
    }
};
