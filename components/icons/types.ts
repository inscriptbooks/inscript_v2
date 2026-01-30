export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export interface NotificationIconProps extends IconProps {
  hasNotification?: boolean;
  circleColor?: string;
}
