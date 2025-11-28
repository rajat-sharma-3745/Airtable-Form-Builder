export default function ConditionalWrapper({ visible, children }) {
  if (!visible) return null;
  return <div className="animate-fadeIn">{children}</div>;
}
