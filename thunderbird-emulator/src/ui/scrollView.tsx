import type { JSX, Component } from 'solid-js';

const ScrollView: Component<{v?: boolean, h?: boolean, style?: string, children?: JSX.Element}> = (props) => {
  let v = props.v || true;
  let h = props.h || false;
  
  return <div style={`overflow-y:${v ? "auto" : "hidden"};overflow-x:${h ? "auto" : "hidden"};${props.style}`}>
    {props.children}
  </div>;
}

export default ScrollView;
