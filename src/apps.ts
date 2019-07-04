export type InitialApp = {
  name: string;
  installationDir: string;
  projectId: string;
};

export const APPS: InitialApp[] = [
  { name: 'sis-controlpanel-api', installationDir: 'Sis.ControlPanel.Api', projectId: 'sis/sis-controlpanel-api' },
  { name: 'sis-controlpanel-web', installationDir: 'Sis.ControlPanel.Web', projectId: 'sis/sis-controlpanel-web' },
  { name: 'sis-identity-api', installationDir: 'Sis.Identity.Api', projectId: 'sis/sis-identity-api' },
  { name: 'sis-presentismo-api', installationDir: 'Sis.Presentismo.Api', projectId: 'sis/sis-presentismo-api' },
  {
    name: 'sis-presentismo-service',
    installationDir: 'Sis.Presentismo.Service',
    projectId: 'sis/sis-presentismo-service'
  },
  { name: 'sis-presentismo-web', installationDir: 'Sis.Presentismo.Web', projectId: 'sis/sis-presentismo-web' },
  {
    name: 'sis-zkaccessscrapper-service',
    installationDir: 'Sis.ZkAccessScrapper.Service',
    projectId: 'sis/sis-zkaccessscrapper-service'
  },
  { name: 'sis-access-service', installationDir: 'Sis.Access.Service', projectId: 'sis/sis-access-service' },
  { name: 'sis-access-api', installationDir: 'Sis.Access.Api', projectId: 'sis/sis-access-api' },
  { name: 'sis-access-web', installationDir: 'Sis.Access.Web', projectId: 'sis/sis-access-web' },
  { name: 'sis-telemetry-service', installationDir: 'Sis.Telemetry.Service', projectId: 'sis/sis-telemetry-service' },
  { name: 'sis-telemetry-api', installationDir: 'Sis.Telemetry.Api', projectId: 'sis/sis-telemetry-api' },
  { name: 'sis-telemetry-web', installationDir: 'Sis.Telemetry.Web', projectId: 'sis/sis-telemetry-web' }
];
