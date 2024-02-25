import { CircleIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export const statuses = [
  {
    value: 'full',
    label: 'Backlog',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'Not full',
    label: 'Todo',
    icon: CircleIcon,
  },
  // {
  //   value: 'in progress',
  //   label: 'In Progress',
  //   icon: StopwatchIcon,
  // },
  // {
  //   value: 'done',
  //   label: 'Done',
  //   icon: CheckCircledIcon,
  // },
  // {
  //   value: 'canceled',
  //   label: 'Canceled',
  //   icon: CrossCircledIcon,
  // },
];
