import React, { ReactNode } from 'react';
import {
  Preview as PurePreview,
  PreviewProps as PurePreviewProps
} from '@storybook/components';

interface PreviewProps extends PurePreviewProps {
  language?: string;
  code: string;
  children?: ReactNode;
}

export const Preview = ({
  language = 'jsx',
  code,
  children,
  withSource,
  ...props
}: PreviewProps) => {
  return React.createElement(
    PurePreview,
    {
      withSource: { ...withSource, code, language },
      ...props
    },
    children
  );
};

export const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));
