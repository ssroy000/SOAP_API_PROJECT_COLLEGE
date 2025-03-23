import { createClientAsync } from 'soap';

async function soapClient() {
  try {
    // Create SOAP client
    const url = 'http://localhost:3000/employeeservice?wsdl';
    const client = await createClientAsync(url);
    
    console.log('SOAP Employee Service Client');
    console.log('---------------------------');
    
    // Get all employees
    console.log('\n1. Getting all employees:');
    const [allEmployeesResult] = await client.getAllEmployeesAsync({});
    console.log(allEmployeesResult);
    
    // Add a new employee
    console.log('\n2. Adding a new employee:');
    const newEmployee = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      position: 'Software Engineer',
      salary: 85000
    };
    const [addResult,str] = await client.addEmployeeAsync(newEmployee);
    console.log(addResult);
    
    // Get the newly added employee by ID
    console.log('\n3. Getting employee by ID:');
    const newEmployeeId = addResult.id;
    const [employeeResult] = await client.getEmployeeAsync({ id: newEmployeeId });
    console.log(employeeResult);
    
    // Update the employee
    console.log('\n4. Updating employee:');
    const updateData = {
      id: newEmployeeId,
      position: 'Senior Software Engineer',
    };
    const [updateResult] = await client.updateEmployeeAsync(updateData);
    console.log(updateResult);
    
    // Get the updated employee
    console.log('\n5. Getting updated employee:');
    const [updatedEmployee] = await client.getEmployeeAsync({ id: newEmployeeId });
    console.log(updatedEmployee);
    
    // Delete the employee
    console.log('\n6. Deleting employee:');
    const [deleteResult] = await client.deleteEmployeeAsync({ id: newEmployeeId });
    console.log(deleteResult);
    
    // Try to get the deleted employee (should return "Not Found")
    console.log('\n7. Trying to get deleted employee:');
    const [deletedEmployeeResult] = await client.getEmployeeAsync({ id: newEmployeeId });
    console.log(deletedEmployeeResult);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the client
soapClient();