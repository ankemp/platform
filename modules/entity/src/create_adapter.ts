import { createSelector } from '@ngrx/store';
import {
  EntityDefinition,
  Comparer,
  IdSelector,
  EntityAdapter,
} from './models';
import { createInitialStateFactory } from './entity_state';
import { createSelectorsFactory } from './state_selectors';
import { createSortedStateAdapter } from './sorted_state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';

export function createEntityAdapter<T>(
  options: {
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
    allowPrototype?: boolean;
  } = {}
): EntityAdapter<T> {
  const { selectId, sortComparer, allowPrototype }: EntityDefinition<T> = {
    sortComparer: false,
    allowPrototype: false,
    selectId: (instance: any) => instance.id,
    ...options,
  };

  const stateFactory = createInitialStateFactory<T>();
  const selectorsFactory = createSelectorsFactory<T>();
  const stateAdapter = sortComparer
    ? createSortedStateAdapter(selectId, sortComparer, allowPrototype)
    : createUnsortedStateAdapter(selectId, allowPrototype);

  return {
    selectId,
    sortComparer,
    ...stateFactory,
    ...selectorsFactory,
    ...stateAdapter,
  };
}
