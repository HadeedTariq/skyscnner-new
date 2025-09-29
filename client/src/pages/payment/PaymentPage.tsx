import { PaymentForm } from "./PaymentForm";

export default function PaymentPage() {
  return (
    <div className="flex flex-col items-center  justify-center w-full py-12 px-12 mt-20 max-[700px]:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Payment
      </h1>
      <div className="w-full lg:col-span-2">
        <PaymentForm />
      </div>
    </div>
  );
}
