import { fetchNutrients, searchFood } from '@/services/api';

export default {
  namespace: 'nutritionix',
  state: {
    nutrientList: [],
    food: [],
  },

  effects: {
    *fetchNutrients({ payload }, { call, put }) {
      try {
        const res = yield call(fetchNutrients, payload);
        yield put({
          type: 'fetchNutrientsEnd',
          payload: res,
        });
      } catch (e) {
        throw e;
      }
    },

    *searchFood({ payload }, { call, put }) {
      try {
        const res = yield call(searchFood, payload);
        yield put({
          type: 'searchFoodEnd',
          payload: res,
        });
      } catch (e) {
        throw e;
      }
    },
  },

  reducers: {
    fetchNutrientsEnd(state, { payload }) {
      if (payload.error) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        nutrientList: payload,
      };
    },
    searchFoodEnd(state, { payload }) {
      if (payload.error) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        food: payload,
      };
    },
  },
};
