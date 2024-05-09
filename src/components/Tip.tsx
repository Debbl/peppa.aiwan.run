import { createPortal } from "react-dom";

export default function Tip(props: {
  showTip: boolean;
  setShowTip: (value: boolean) => void;
}) {
  const handleClick = () => {
    props.setShowTip(false);
  };

  if (!props.showTip) return null;

  return createPortal(
    <div
      onClick={() => handleClick()}
      className="fixed inset-0 flex items-center justify-center bg-gray-100/50"
    >
      <div className="rounded-md border bg-pink-500 p-6">
        请导入文件夹中的 第*季第*集***-中英台词.xlsx 文件
      </div>
    </div>,
    document.body,
  );
}
