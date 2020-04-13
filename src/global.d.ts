declare module '*.yml' {
  const content: string;
  export default content;
}


interface Window {
  api: {
    receive(channel: string, listener: (...args: any[]) => void): void;
    send(channel: string, ...args: any[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
  }
}

declare module 'react-pie-menu';
