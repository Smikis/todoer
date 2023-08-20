import {Task} from './task';

export type Group = {
  group: string;
  id: string;
  order: number;
  collapsed: boolean;
  tasks: Task[];
};
