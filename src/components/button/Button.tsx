import { ButtonContainer } from "./ButtonContainer";
import { ButtonContent } from "./ButtonContent";

interface Button {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function Button({ className, icon, label, onClick }: Button) {
  return (
    <>
      <ButtonContainer className={className} handleClick={onClick}>
        <ButtonContent icon={icon} label={label} />
      </ButtonContainer>
    </>
  );
}
