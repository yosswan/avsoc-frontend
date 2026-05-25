const path = require("path");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-toast-notifications': path.join(__dirname, 'lib/toast-wrapper.tsx'),
    };
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    return config;
  },
  transpilePackages: ['@ant-design/icons', '@ant-design/icons-svg', 'antd', 'rc-util', 'rc-picker', 'rc-tooltip', 'rc-table', 'rc-tree-select', 'rc-tree', 'rc-segmented', 'rc-slider', 'rc-dropdown', 'rc-overflow', 'rc-dialog', 'rc-notification', 'rc-steps', 'rc-switch', 'rc-tabs', 'rc-textarea', 'rc-input', 'rc-input-number', 'rc-image', 'rc-cascader', 'rc-checkbox', 'rc-collapse', 'rc-drawer', 'rc-field-form', 'rc-mentions', 'rc-pagination', 'rc-progress', 'rc-rate', 'rc-upload', 'rc-virtual-list', 'rc-motion', 'dayjs', 'scroll-into-view-if-needed', 'throttle-debounce', 'compute-scroll-into-view', 'copy-to-clipboard'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = withPWA(nextConfig);