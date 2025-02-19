import { Preview } from "../../src/components/Preview";
import { useFormStore } from "../../src/hooks/useFormStore";

describe("<Preview />", () => {
    beforeEach(() => {
        cy.mount(<Preview />);
    });

    it("should render a question correctly", () => {
        useFormStore.setState({
            questions: [{ id: "1", formName: "Cypress Testing Form", questionLabel: "What is your name?", questionType: "text" }]
        });

        cy.contains("What is your name?").should("be.visible");
    });

    it("should update the input values correctly", () => {
        useFormStore.setState({
            questions: [{ id: "1", formName: "Cypress Testing Form", questionLabel: "What is your name?", questionType: "text" }]
        });

        cy.get("input").type("Abhinav Anshul");
        cy.get("input").should("have.value", "Abhinav Anshul");
    });

});