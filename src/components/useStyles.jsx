import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

const UseStyles = makeStyles(() => {
  return createStyles({
    scrollBar: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "0.4em",
        },
        "*::-webkit-scrollbar-track": {
          "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0)",
          outline: "1px solid slategrey",
        },
      },
    },
  });
});

export default UseStyles;
