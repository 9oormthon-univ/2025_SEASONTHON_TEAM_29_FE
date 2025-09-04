import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import PhotoCard from '@/components/Mypage/PhotoCard';

const meta = {
  title: 'Mypage/PhotoCard',
  component: PhotoCard,
  parameters: { layout: 'centered' },
  args: { files: [], total: 5, onUpload: () => {} },
  argTypes: {
    total: { control: { type: 'number', min: 1, max: 10, step: 1 } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PhotoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const svgThumb = (n: number, fill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <rect width='100%' height='100%' rx='16' fill='${fill}'/>
       <text x='50%' y='50%' dy='.32em' text-anchor='middle' font-size='56' font-family='Inter,system-ui' fill='white'>${n}</text>
     </svg>`,
  )}`;

async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type });
}

export const Empty: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <PhotoCard
        {...args}
        files={files}
        onUpload={(fl) =>
          setFiles((prev) => [...prev, ...Array.from(fl)].slice(0, args.total))
        }
      />
    );
  },
};

export const Prefilled: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    useEffect(() => {
      (async () => {
        const urls = [
          svgThumb(1, '#8b5cf6'),
          svgThumb(2, '#22c55e'),
          svgThumb(3, '#f97316'),
          svgThumb(4, '#ef4444'),
        ];
        const list = await Promise.all(
          urls.map((u, i) => dataUrlToFile(u, `sample-${i + 1}.svg`)),
        );
        setFiles(list);
      })();
    }, []);
    return (
      <PhotoCard
        {...args}
        files={files}
        onUpload={(fl) =>
          setFiles((prev) => [...prev, ...Array.from(fl)].slice(0, args.total))
        }
      />
    );
  },
};
