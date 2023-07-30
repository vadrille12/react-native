import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRoute } from "../router";
import { refresh } from "../redux/auth/authOperations";

export const Main = () => {
  const dispatch = useDispatch();
  const { stateChange } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(refresh());
  }, []);

  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
