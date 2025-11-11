import React, { createContext, useState, ReactNode } from 'react';
import { slideToggle } from '../../composables/slideToggle';

interface PanelContextType {
  expand: boolean;
  reload: boolean;
  remove: boolean;
  toggleExpand: () => void;
  toggleReload: () => void;
  toggleRemove: () => void;
  toggleCollapse: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PanelStat = createContext<PanelContextType | undefined>(undefined);

interface PanelProps {
  theme?: string;
  className?: string;
  children: ReactNode;
}

function Panel({ theme, className, children }: PanelProps) {
  const [expand, setExpand] = useState(false);
  const [reload, setReload] = useState(false);
  const [remove, setRemove] = useState(false);

  const toggleExpand = () => setExpand(!expand);
  const toggleRemove = () => setRemove(!remove);
  const toggleCollapse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const panelBody = e.currentTarget.closest('.panel')?.querySelector('.panel-body');
    if (panelBody) slideToggle(panelBody as HTMLElement);
  };
  
  const toggleReload = () => {
    if (!reload) {
      setReload(true);
      setTimeout(() => setReload(false), 2000);
    }
  };

  const panelState: PanelContextType = {
    expand,
    reload,
    remove,
    toggleExpand,
    toggleReload,
    toggleRemove,
    toggleCollapse,
  };

  return (
    <PanelStat.Provider value={panelState}>
      {!remove && (
        <div className={`panel panel-${theme ?? 'inverse'} ${expand ? 'panel-expand' : ''} ${reload ? 'panel-loading' : ''} ${className ?? ''}`}>
          {children}
        </div>
      )}
    </PanelStat.Provider>
  );
}

interface PanelHeaderProps {
  className?: string;
  noButton?: boolean;
  children: ReactNode;
}

function PanelHeader({ className, noButton, children }: PanelHeaderProps) {
  return (
    <div className={`panel-heading ${className ?? ''}`}>
      <h4 className="panel-title">{children}</h4>
      {!noButton && (
        <PanelStat.Consumer>
          {(context) => {
            if (!context) throw new Error("PanelHeader must be used within a Panel");
            const { toggleExpand, toggleRemove, toggleCollapse, toggleReload } = context;
            return (
              <div className="panel-heading-btn">
                <button className="btn btn-xs btn-icon btn-circle btn-default" onClick={toggleExpand}>
                  <i className="fa fa-expand"></i>
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-xs btn-icon btn-circle btn-success" onClick={toggleReload}>
                  <i className="fa fa-redo"></i>
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-xs btn-icon btn-circle btn-warning" onClick={toggleCollapse}>
                  <i className="fa fa-minus"></i>
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-xs btn-icon btn-circle btn-danger" onClick={toggleRemove}>
                  <i className="fa fa-times"></i>
                </button>
              </div>
            );
          }}
        </PanelStat.Consumer>
      )}
    </div>
  );
}

interface PanelBodyProps {
  className?: string;
  children: ReactNode;
}

function PanelBody({ className, children }: PanelBodyProps) {
  return (
    <PanelStat.Consumer>
      {(context) => {
        if (!context) throw new Error("PanelBody must be used within a Panel");
        const { reload } = context;
        return (
          <div className={`panel-body ${className ?? ''}`}>
            {children}
            {reload && (
              <div className="panel-loader">
                <span className="spinner spinner-sm"></span>
              </div>
            )}
          </div>
        );
      }}
    </PanelStat.Consumer>
  );
}

interface PanelFooterProps {
  className?: string;
  children: ReactNode;
}

function PanelFooter({ className, children }: PanelFooterProps) {
  return <div className={`panel-footer ${className ?? ''}`}>{children}</div>;
}

export { Panel, PanelHeader, PanelBody, PanelFooter };
