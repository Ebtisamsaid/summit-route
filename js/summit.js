

$(function(){
    $('#fadeInTitle').hide().fadeIn(3000); 
})


let data = {
    "customers": [
        { "id": 1, "name": "Ahmed Ali" },
        { "id": 2, "name": "Aya Elsayed" },
        { "id": 3, "name": "Mina Adel" },
        { "id": 4, "name": "Sarah Reda" },
        { "id": 5, "name": "Mohamed Sayed" }
    ],
    "transactions": [
        { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
        { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
        { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
        { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
        { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
        { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
        { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
        { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
        { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
    ]
};

function displayCombinedData(transactions) {
    const combinedBody = document.getElementById('combined-body');
    combinedBody.innerHTML = '';

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        acc[transaction.customer_id] = acc[transaction.customer_id] || [];
        acc[transaction.customer_id].push(transaction);
        return acc;
    }, {});
    const customerIds = Object.keys(groupedTransactions);
    for (const customerId in groupedTransactions) {
        const customer = data.customers.find(c => c.id === parseInt(customerId));
        const transactionsForCustomer = groupedTransactions[customerId];

        const transactionDetails = transactionsForCustomer.map(t => `Date:${t.date}<br>Amount: Egp ${t.amount}<br>`).join('');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fs-4 rounded-table">${customer.id}</td>
            <td class="fs-4 rounded-table">${customer.name}</td>
            <td class="fs-6 rounded-table">${transactionDetails}</td>
        `;

      
        row.addEventListener('click', () => {
            renderTransactionChart(transactionsForCustomer);
        });

        combinedBody.appendChild(row);
    }
    if (customerIds.length > 0) {
        const firstCustomerId = customerIds[0];
        const firstCustomerTransactions = groupedTransactions[firstCustomerId];
        if (firstCustomerTransactions) {
            renderTransactionChart(firstCustomerTransactions);
        }
    }
   

    
   
}

function renderTransactionChart(transactions) {
    const ctxf = document.getElementById('transactionChart')
    const ctxs = document.getElementById('transactionChart2')

    const labels = transactions.map(t => t.date);
    const amounts = transactions.map(t => t.amount);

   
   
    // Destroy previous chart instances if they exist
    if (window.myctxf) {
        window.myctxf.destroy();
    }
    if (window.myctxs) {
        window.myctxs.destroy();
    }
    //  new chart
     window.myctxf= new Chart(ctxf, {
        type: 'doughnut', 
        data: {
            labels: labels,
            datasets: [{
                label: 'Transaction Amount',
                data: amounts,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                  ],
                  hoverOffset: 4,
                borderColor: 'pink',
                borderWidth: 1
            }],
           
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            weight: 'bolder' ,
                            size:18
                        }
                    }
                }
            },
            
            scales: {
           

                y: {
                    beginAtZero: true
                }
            }
            
        },
        responsive: true,
        maintainAspectRatio: false
    });





window.myctxs = new Chart(ctxs, {
    type: 'bar', 
    data: {
        labels: labels,
        datasets: [{
            label: 'Transaction Amount',
            data: amounts,
            backgroundColor: ['red','green'] ,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        weight: 'bolder' ,
                        size:30
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (EGP)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false 
    }
});
}

displayCombinedData(data.transactions);

// Filter functionality
document.getElementById('transaction-filter').addEventListener('input', function() {
    const filterValue = parseFloat(this.value);
    const filteredTransactions = data.transactions.filter(transaction => 
        !isNaN(filterValue) ? transaction.amount >= filterValue : true
    );
    displayCombinedData(filteredTransactions);
});
// Reset filter functionality
document.getElementById('reset-button').addEventListener('click', function() {
    const filterInput = document.getElementById('transaction-filter');
    filterInput.value = ''; 
    displayCombinedData(data.transactions); 

  

    
    renderTransactionChart(data.transactions);
});


