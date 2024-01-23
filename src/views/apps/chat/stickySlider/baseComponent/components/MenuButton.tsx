import classNames from 'classnames';
import React from 'react';

interface MenuButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> {
  component?: string | React.ReactElement;
  children?: React.ReactNode;
}

interface MenuButtonStylesProps {
  level: number;
  collapsed?: boolean;
  rtl?: boolean;
  disabled?: boolean;
  active?: boolean;
}

export const menuButtonStyles = (props: MenuButtonStylesProps) => {
  const { rtl, level, collapsed, disabled, active } = props;
  //    ${rtl
  //     ? `padding-left: 35px;
  //          padding-right: ${level === 0 ? 20 : (collapsed ? level : level + 1) * 20}px;
  //           `
  //     : `padding-right: 20px;
  //          padding-left: ${level === 0 ? 20 : (collapsed ? level : level + 1) * 20}px;
  //          `
  //   } 

  return `
    display: flex;
    align-items: center;
    height: 50px;
    text-decoration: none;
    color: inherit;
    box-sizing: border-box;
    cursor: pointer;
    padding-left: 15px;
    padding-right: 20px;
    flex-direction: column;
    margin-top:20px;

  

    &:hover {
      background-color: #f3f3f3;
    }

    ${disabled &&
    ` 
      pointer-events: none;
      cursor: default;
      color:#adadad;
        `
    }

    ${active && 'background-color: #e2eef9;'}
  
  `;
};

export const MenuButtonRef: React.ForwardRefRenderFunction<HTMLAnchorElement, MenuButtonProps> = (
  { className, component, children, ...rest },
  ref,
) => {
  if (component) {
    if (typeof component === 'string') {
      return React.createElement(
        component,
        {
          className: classNames(className),
          ...rest,
          ref,
        },
        children,
      );
    } else {
      const { className: classNameProp, ...props } = component.props;

      return React.cloneElement(
        component,
        {
          className: classNames(className, classNameProp),
          ...rest,
          ...props,
          ref,
        },
        children,
      );
    }
  } else {
    return (
      <a ref={ref} className={classNames(className)} {...rest}>
        {children}
      </a>
    );
  }
};

export const MenuButton = React.forwardRef<HTMLAnchorElement, MenuButtonProps>(MenuButtonRef);
