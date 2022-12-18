import { gql } from "urql";
export const GetBookings = gql`
  query ($vendorId: String!) {
    getBookings(vendorId: $vendorId) {
      times {
        startTime
        endTime
        date
      }
    }
  }
`;