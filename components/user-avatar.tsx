/**
 * UserAvatar Component
 *
 * The UserAvatar component is used to display a user's avatar image.
 *
 * @component
 *
 * @param {string} src - The source URL of the user's avatar image.
 * @param {string} className - Additional CSS classes to be applied to the component.
 *
 * @example
 * // Example usage of UserAvatar component
 * <UserAvatar src="/path/to/avatar.jpg" className="custom-class" />
 *
 * @returns {JSX.Element} The UserAvatar component.
 */

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  src?: string; // The source URL of the user's avatar image
  className?: string; // Additional CSS classes
}

export default function UserAvatar({ src, className }: Props) {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
}
