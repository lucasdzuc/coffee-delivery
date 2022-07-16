import { TitleText } from "../../../../components/Typeography";
import { coffees } from "../../../../data/coffees";
import { CoffeeCard } from "../CoffeCard";
import { CoffeeList, OurCoffeesContainer } from "./styles";

export function OurCoffees(){

  return (
    <OurCoffeesContainer className="container">
      <TitleText size="l" color="subtitle">
        Nossos cafés
      </TitleText>

      <CoffeeList>
        {coffees.map((coffee: any) => ((
          <CoffeeCard key={coffee.id} coffee={coffee} />
        )))}
      </CoffeeList>
    </OurCoffeesContainer>
  );

}