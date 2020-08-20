export const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

export const mainStyle = {
	app: {
		margin: "120px 0"
	},
	button: {
		backgroundColor: "#408cec",
		border: 0,
		padding: "12px 20px",
		color: "#fff",
		margin: "0 auto",
		width: 150,
		display: "block",
		borderRadius: 3
	}
};

export const colourStyles = {
  container: (base, state) => ({
      ...base,
    }),
    valueContainer: (base, state) => ({
      ...base,
    }),
    multiValue:(base, state) => ({
      ...base,
      backgroundColor: "#f4f7f8"
    }),
    indicatorSeparator: (base, state) => ({
      ...base,
      backgroundColor: "#fff"
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "#000"
    }),
    // option: (base, state) => ({
    //   ...base,
    //   color: "#f4f7f8 !important",
    //   backgroundColor: '#e8eeef !imporatnt'
    // }),
  menu: styles => ({ ...styles, backgroundColor: '#e8eeef' }),
  control: styles => ({ ...styles, backgroundColor: '#e8eeef' }),
   option: styles => ({ ...styles, color: '#f4f7f8 !imporatnt' }),
};