

export async function calculate_age(birthday: string) {
	const birthdate = new Date(birthday)
	const today = new Date()
	let age : number = Number(today.getFullYear) - Number(birthdate.getFullYear)
				
  	const monthDifference = today.getMonth() - birthdate.getMonth();
	
	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    	age--;
  	}
	return age;

}