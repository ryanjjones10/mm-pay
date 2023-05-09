import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'

import { DataStore } from '@app/types'

import { AppState } from './root.reducer'

// @todo: remove hack
export const getAppState = (s: AppState): DataStore => s.database as DataStore

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector
