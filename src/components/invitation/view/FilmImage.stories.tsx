import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import FilmImage from './FilmImage';

const meta: Meta<typeof FilmImage> = {
  title: 'Invitation/FilmImage',
  component: FilmImage,
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
};
export default meta;

type Story = StoryObj<typeof FilmImage>;

export const Default: Story = {
  args: {
    photos: ['/mock/sample-1.jpg', '/mock/sample-2.jpg', '/mock/sample-3.jpg'],
  },
};
export const UploadPlayground: Story = {
  render: (args) => <UploadWrapper {...args} />,
  args: {
    photos: [null, null, null],
  },
};

function UploadWrapper(props: React.ComponentProps<typeof FilmImage>) {
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [urls, setUrls] = useState<
    [string | null, string | null, string | null]
  >([null, null, null]);

  useEffect(() => {
    const next = files.map((f) => (f ? URL.createObjectURL(f) : null)) as [
      string | null,
      string | null,
      string | null,
    ];
    setUrls(next);
    return () => next.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <label key={i} className="inline-flex items-center gap-2">
            <span className="text-xs text-gray-600">#{i + 1}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFiles((prev) => {
                  const cp = [...prev];
                  cp[i] = f;
                  return cp;
                });
              }}
            />
          </label>
        ))}
      </div>

      <FilmImage {...props} photos={urls} />
    </div>
  );
}
