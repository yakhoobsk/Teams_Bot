import { useDispatch, useSelector, type TypedUseSelectorHook, } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/**
 * Typed version of useDispatch
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed version of useSelector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;