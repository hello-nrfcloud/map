# [hello.nrfcloud.com/map](https://hello.nrfcloud.com/map)

[![GitHub Actions](https://github.com/hello-nrfcloud/map/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/hello-nrfcloud/map/actions/workflows/test-and-release.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![@commitlint/config-conventional](https://img.shields.io/badge/%40commitlint-config--conventional-brightgreen)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

Map application written with [Solid.js](https://www.solidjs.com/).

## Project vision

Built a showcase that highlights Nordic Semiconductor's cellular IoT solutions
by showing thousands of real connected devices, empowering customers to promote
their solutions that make Nordic's ecosystem the best, and gathering valuable
data to help future customer in their go-to-market efforts.

Overall, hello.nrfcloud.com/map shows a world where cellular IoT is seamlessly
integrated into everyday life, powered by Nordic Semiconductor technology and
fueled by a vibrant community of innovators.

### Key Objectives

- **Promote Nordic Semiconductor cellular IoT solutions**: Showcase real-world
  deployments of cellular IoT devices powered by Nordic Semiconductor hardware,
  demonstrating their diverse applications and capabilities to a global
  audience.
- **Empower customers**: Provide a platform for customers to easily showcase
  their innovative products built with Nordic technology, increasing brand
  awareness and driving sales.
- **Collect up-to-date connectivity statistics**: Gather real-time data on
  cellular network performance and device behavior from around the world,
  providing valuable insights for Nordic Semiconductor, network operators, and
  the broader IoT community.

### Impact

- **Accelerate the adoption of cellular IoT**: By showcasing successful
  deployments and customer solutions, hello.nrfcloud.com/map will inspire
  developers and businesses to embrace cellular IoT technology.

- **Strengthen the Nordic Semiconductor ecosystem**: The platform will connect
  customers, developers, and partners, fostering collaboration and innovation
  within the cellular IoT space.

- **Drive industry insights**: The collected data will provide valuable insights
  into cellular network performance, device behavior, and emerging trends,
  benefiting all stakeholders in the IoT ecosystem.

### Solution

This is achieved through:

- **Seamless onboarding of Custom Devices**: Leverages a well-defined API for
  device registration, eliminating manual configuration and streamlining the
  process. This allows the number of shown devices to grow organically.

- **LwM2M for Universal Data Representation**: LwM2M data objects carry embedded
  metadata, enabling automatic visualization without custom UI development. The
  platform supports
  [various LwM2M objects](https://github.com/hello-nrfcloud/proto-lwm2m) for
  flexible data representation. This allows any customer to integrate their
  device's data into the through describing it via an LwM2M object (or reusing
  an existing one) without the need for custom development.

- **Customizable User Interface for Personalized Storytelling:**

  - Provides a customizable UI, allowing users to curate and showcase specific
    devices or groups.
  - Enables filtering and sorting of devices based on various attributes like
    location, application, or sensor data.
  - Offers map-based visualization for geographically distributed deployments.
  - Integrates with external data sources for contextual enrichment (e.g., nRF
    Cloud Location API, Memfault Device Health Metrics, etc. ...).
