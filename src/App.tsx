import React, { useState } from 'react';
import {
  TopBar,
  ContextHeader,
  Workspace,
  ProofFooter,
  type StatusType,
  type ChecklistItem,
} from './components/layout';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Badge,
  StatusIndicator,
  PromptBox,
  EmptyState,
  ErrorState,
} from './components/ui';
import './App.css';

function App() {
  const [status, setStatus] = useState<StatusType>('in-progress');
  const [checklist] = useState<ChecklistItem[]>([
    { label: 'UI Built', checked: true },
    { label: 'Logic Working', checked: true },
    { label: 'Test Passed', checked: false },
    { label: 'Deployed', checked: false },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length < 3) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError('');
    }
  };



  const SidebarContent = (
    <div className="sidebar">
      <Card>
        <CardHeader>
          <CardTitle>Step Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This sidebar demonstrates the secondary panel pattern. It contains
            supplementary information and actions that support the primary workspace.
          </p>
        </CardContent>
      </Card>

      <div style={{ marginTop: '24px' }}>
        <PromptBox
          label="Example Prompt"
          content="Create a new job notification with the following criteria: Location: Remote, Role: Senior Developer, Keywords: React, TypeScript"
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <StatusIndicator state="idle" />
              <StatusIndicator state="loading" />
              <StatusIndicator state="success" />
              <StatusIndicator state="error" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="app">
      <TopBar
        appName="Job Notification App"
        currentStep={2}
        totalSteps={5}
        status={status}
      />

      <ContextHeader
        title="Design System Foundation"
        subtitle="A calm, intentional, and coherent foundation for building premium SaaS experiences."
      />

      <Workspace sidebar={SidebarContent}>
        <div className="primary-content">
          <Card>
            <CardHeader>
              <CardTitle>Component Showcase</CardTitle>
            </CardHeader>
            <CardContent>
              <section className="showcase-section">
                <h4>Buttons</h4>
                <div className="button-group">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
                <div className="button-group" style={{ marginTop: '16px' }}>
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </section>

              <section className="showcase-section">
                <h4>Badges</h4>
                <div className="badge-group">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
              </section>

              <section className="showcase-section">
                <h4>Form Inputs</h4>
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  helperText="We'll never share your email."
                  fullWidth
                />
                <div style={{ marginTop: '16px' }}>
                  <Input
                    label="Username"
                    value={inputValue}
                    onChange={handleInputChange}
                    error={inputError}
                    placeholder="Enter username"
                    fullWidth
                  />
                </div>
              </section>

              <section className="showcase-section">
                <h4>Status Toggle</h4>
                <div className="button-group">
                  <Button variant="secondary" size="sm" onClick={() => setStatus('not-started')}>
                    Not Started
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setStatus('in-progress')}>
                    In Progress
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setStatus('shipped')}>
                    Shipped
                  </Button>
                </div>
              </section>
            </CardContent>
          </Card>

          <div style={{ marginTop: '24px' }}>
            <Card>
              <CardHeader>
                <CardTitle>State Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="state-examples">
                  <div className="state-example">
                    <h5>Empty State</h5>
                    <EmptyState
                      title="No notifications yet"
                      description="Set up your first job alert to start receiving notifications."
                      actionLabel="Create Alert"
                      onAction={() => console.log('Create alert clicked')}
                    />
                  </div>
                  <div className="state-example">
                    <h5>Error State</h5>
                    <ErrorState
                      message="Unable to connect to the notification service."
                      solution="Check your internet connection and try again. If the problem persists, contact support."
                      onRetry={() => console.log('Retry clicked')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Workspace>

      <ProofFooter items={checklist} />
    </div>
  );
}

export default App;
