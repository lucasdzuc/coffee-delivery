import { CompleteOrderForm } from "./CompleteOrderForm";
import { SelectedCoffees } from "./SelectedCoffees";
import { CompleteOrderContainer } from "./styles";
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

enum PaymentMethods {
  credit = "credit",
  debit = "debit",
  money = "money"
}

const confimOrderFormValidationSchema = zod.object({
  cep: zod.string().min(1, "Infome o CEP"),
  street: zod.string().min(1, "Informe o Rua"),
  number: zod.string().min(1, "Informe o Número"),
  complement: zod.string(),
  district: zod.string().min(1, "Informe o Bairro"),
  city: zod.string().min(1, "Informe a Cidade"),
  uf: zod.string().min(1, "Informe a UF"),
  paymentMethod: zod.nativeEnum(PaymentMethods, {
    errorMap: () => {
      return { message: "Informe o método de pagamento" };
    },
  }),

});

export type OrderData = zod.infer<typeof confimOrderFormValidationSchema>;

type ConfirmOrderFormData = OrderData;

export function CompleteOrderPage(){

  const { cleanCart } = useCart();

  const confirmedOrderForm = useForm<ConfirmOrderFormData>({
    resolver: zodResolver(confimOrderFormValidationSchema)
  });

  const { handleSubmit } = confirmedOrderForm;

  const navigate = useNavigate();

  function handleConfirmOrder(data: ConfirmOrderFormData){
    navigate("/orderConfirmed", {
      state: data
    });
    cleanCart();
  }

  return (
    <FormProvider {...confirmedOrderForm}>
      <CompleteOrderContainer className="container" onSubmit={handleSubmit(handleConfirmOrder)}>
        <CompleteOrderForm />
        <SelectedCoffees />
      </CompleteOrderContainer>
    </FormProvider>
  )
}