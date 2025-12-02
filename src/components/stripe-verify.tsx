import React from "react";
import { Link, Button } from "@payloadcms/ui";

export const StripeVerify = () => {
  return (
    <Link href="/stripe-verify">
      <Button>Verify Account</Button>
    </Link>
  );
};

export default StripeVerify;
