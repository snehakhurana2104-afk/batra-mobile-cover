import React from "react";
import AccessoryCategory from "./AccessoryCategory.jsx";

export default function EarphonesHeadphones(props) {
  return (
    <AccessoryCategory
      {...props}
      category="Earphones & Headphones"
      title="Earphones & Headphones"
      subtitle="Enjoy your music, calls and everyday listening."
      icon="♫"
    />
  );
}