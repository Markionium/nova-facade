import React from "react";
import { NovaGraphQL } from "@nova/types";
import { render } from "@testing-library/react";
import { NovaGraphQLProvider, useNovaGraphQL } from "./nova-graphql-provider";

describe(useNovaGraphQL, () => {
  it("throws without a provider", () => {
    expect.assertions(1);

    const TestUndefinedContextComponent: React.FC = () => {
      try {
        useNovaGraphQL();
      } catch (e) {
        expect((e as Error).message).toMatch(
          "Nova GraphQL provider must be initialized prior to consumption!"
        );
      }
      return null;
    };

    render(<TestUndefinedContextComponent />);
  });

  it("is able to access the GraphQL instance provided by the provider", () => {
    expect.assertions(3);

    const graphql = ({
      useLazyLoadQuery: jest.fn()
    } as unknown) as NovaGraphQL;

    const TestPassedContextComponent: React.FC = () => {
      const graphqlFromContext = useNovaGraphQL();
      expect(graphqlFromContext).toBe(graphql);
      expect(graphqlFromContext.useLazyLoadQuery).toBeDefined();
      // TODO figure out if this is needed
      if(!graphqlFromContext.useLazyLoadQuery){
        return null;
      };
      graphqlFromContext.useLazyLoadQuery("foo", {});
      expect(graphql.useLazyLoadQuery).toBeCalledTimes(1);
      return null;
    };

    render(
      <NovaGraphQLProvider graphql={graphql}>
        <TestPassedContextComponent />
      </NovaGraphQLProvider>
    );
  });
});
