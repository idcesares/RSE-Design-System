// Type smoke test for the public surface (npm run test:types). It compiles every .d.ts reachable
// from index.d.ts under `strict`, and the @ts-expect-error lines prove the types reject misuse:
// if a prop union is widened to `string` by mistake, the expectation goes unused and tsc fails.
import * as React from 'react';
import {
  Button, Badge, Alert, Card, DataTable, Icon, Tabs, Modal, Stat, iconNames,
  type ButtonProps, type IconName,
} from '../../../index';
import { light, type TokenName } from '../../../dist/tokens';

const ref = React.createRef<HTMLButtonElement>();
const props: ButtonProps = { variant: 'secondary', size: 'lg', children: 'Saiba mais' };
const icon: IconName = iconNames[0];
const body: string = light['--rse-color-text-body' satisfies TokenName];
void body;

export const ok = (
  <>
    <Button ref={ref} {...props} onClick={() => {}} />
    <Button href="/matricula" variant="ghost">Quero me inscrever</Button>
    <Badge tone="success">Aberta</Badge>
    <Alert tone="info" title="Inscrições" message="Período de exemplo." />
    <Card title="Ensino médio">Conteúdo</Card>
    <DataTable columns={[{ key: 'turma', label: 'Turma' }]} rows={[{ turma: '1º ano' }]} />
    <Icon name={icon} />
    <Stat value="00" label="Unidades · exemplo" />
    <Modal open onClose={() => {}} title="Confirmar">Texto</Modal>
    <Tabs tabs={[{ id: 'a', label: 'Visão geral' }]} />
  </>
);

export const rejected = (
  <>
    {/* @ts-expect-error — not a Button variant */}
    <Button variant="danger">x</Button>
    {/* @ts-expect-error — not a Badge tone */}
    <Badge tone="purple">x</Badge>
    {/* @ts-expect-error — not an icon name */}
    <Icon name="not-an-icon" />
    {/* @ts-expect-error — DataTable needs columns and rows */}
    <DataTable />
  </>
);
