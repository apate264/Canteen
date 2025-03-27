document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const form = document.getElementById('customOrderForm');
    const foodTypeInputs = document.querySelectorAll('input[name="foodType"]');
    const sushiOptions = document.getElementById('sushiOptions');
    const hotChipsOptions = document.getElementById('hotChipsOptions');
    const sausageRollOptions = document.getElementById('sausageRollOptions');
    const steakPieOptions = document.getElementById('steakPieOptions');
    const chickenSaladRollOptions = document.getElementById('chickenSaladRollOptions');
    const ricePaperRollsOptions = document.getElementById('ricePaperRollsOptions');
    const coffeeOptions = document.getElementById('coffeeOptions');
    const foodSummaryItems = document.getElementById('foodSummaryItems');
    const drinkSummaryItems = document.getElementById('drinkSummaryItems');
    const allergySummaryItems = document.getElementById('allergySummaryItems');
    const summaryTotalPrice = document.getElementById('summaryTotalPrice');
    const customerNameInput = document.getElementById('customerName');
    const allergyInputs = document.querySelectorAll('input[name="allergies"]');
    const allergyNotes = document.getElementById('allergyNotes');

    // State management
    let selectedFoodTypes = []; // Changed to array to support multiple selections
    let selectedProtein = 'chickenKatsu';
    let selectedRiceType = 'white';
    let selectedToppings = [];
    let selectedSauce = 'none';
    let comboSelected = false;
    let selectedDrink = 'none';
    let customerName = '';
    let selectedAllergies = [];
    
    // New food item customization options
    let selectedChipSize = 'regular';
    let selectedSausageType = 'regular';
    let selectedPieType = 'regular';
    let selectedBreadType = 'white';
    let selectedRollExtras = [];
    let selectedRicePaperQuantity = 'two';

    // Coffee customization options
    let coffeeMilk = 'regular';
    let coffeeSize = 'regular';

    // Quantities for items
    const quantities = {
        chickenKatsu: 1,
        tunaSalad: 1,
        spicyPrawn: 1,
        avocado: 1,
        cucumber: 1,
        carrot: 1,
        whiteRice: 1,
        brownRice: 1,
        softDrink: 1,
        water: 1,
        coffee: 1,
        cheese: 1,
        egg: 1
    };

    // Helper functions
    function formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }

    function calculateItemPrice(type, quantity = 1) {
        switch (type) {
            // Base items
            case "sushi":
                return 5.00;
            case "sausageRoll":
                return 4.00;
            case "hotChips":
                return 3.50;
            case "steakPie":
                return 5.50;
            case "chickenSaladRoll":
                return 5.00;
            case "ricePaperRolls":
                return 4.00;
                
            // Protein options
            case "tunaSalad":
                return 0.50 * quantity;
            case "spicyPrawn":
                return 1.50 * quantity;
                
            // Toppings and extras
            case "avocado":
                return 1.00 * quantity;
            case "cucumber":
                return 0.50 * quantity;
            case "carrot":
                return 0.75 * quantity;
            case "cheese":
                return 0.50 * quantity;
            case "egg":
                return 0.75 * quantity;
                
            // Rice and bread types
            case "brown":
                return 1.00 * quantity;
            case "wholemeal":
                return 0.50;
            case "glutenFree":
                return 1.00;
                
            // Sauces
            case "soy":
            case "mayo":
            case "teriyaki":
            case "tomato":
            case "bbq":
                return 0.50;
                
            // Customization options
            case "spicy": // Spicy sausage roll
                return 0.50;
            case "mushroom": // Steak pie with mushroom
                return 0.75;
            case "large": // Large size for chips or coffee
                return 1.50;
            case "four": // 4 rice paper rolls
                return 3.50;
                
            // Drinks
            case "softDrink":
                return 2.50 * quantity;
            case "water":
                return 1.50 * quantity;
            case "coffee":
                return 4.00 * quantity;
                
            // Coffee milk options
            case "soyMilk":
            case "oatMilk":
                return 1.00;
                
            // Combo price
            case "combo":
                return 4.00;
                
            default:
                return 0;
        }
    }

    // Initialize the form
    function initializeForm() {
        // Don't pre-select any food items
        selectedFoodTypes = []; // Start with empty array
        selectedFoodType = ''; // Clear the selected food type
        
        // Make sure all food option checkboxes are unchecked
        const foodTypeCheckboxes = document.querySelectorAll('input[name="foodType"]');
        foodTypeCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Hide all food customization sections
        if (sushiOptions) sushiOptions.classList.add('hidden');
        if (hotChipsOptions) hotChipsOptions.classList.add('hidden');
        if (sausageRollOptions) sausageRollOptions.classList.add('hidden');
        if (steakPieOptions) steakPieOptions.classList.add('hidden');
        if (chickenSaladRollOptions) chickenSaladRollOptions.classList.add('hidden');
        if (ricePaperRollsOptions) ricePaperRollsOptions.classList.add('hidden');


        // Make sure drink options are always visible
        const drinkOptions = document.getElementById('drinkOptions');
        if (drinkOptions) drinkOptions.classList.remove('hidden');
        
        // Select default protein
        const chickenKatsuRadio = document.querySelector('input[name="sushiProtein"][value="chickenKatsu"]');
        if (chickenKatsuRadio) {
            chickenKatsuRadio.checked = true;
            selectedProtein = 'chickenKatsu';
        }
        
        // Select default rice type
        const whiteRiceRadio = document.querySelector('input[name="riceType"][value="white"]');
        if (whiteRiceRadio) {
            whiteRiceRadio.checked = true;
            selectedRiceType = 'white';
        }

        // Set drink to none
        const noDrinkRadio = document.querySelector('input[name="drink"][value="none"]');
        if (noDrinkRadio) {
            noDrinkRadio.checked = true;
            selectedDrink = "none";
        }
        
        // Update the UI based on initial selections
        updateUI();
        // Clear order summary
        clearOrderSummary();
    }
    
    // Clear order summary
    function clearOrderSummary() {
        // Set empty state for food items
        if (foodSummaryItems) {
            foodSummaryItems.innerHTML = '<div class="empty-state">No food items added yet</div>';
        }
        
        // Set empty state for drinks
        if (drinkSummaryItems) {
            drinkSummaryItems.innerHTML = '<div class="empty-state">No drinks added yet</div>';
        }
        
        // Set empty state for allergies
        if (allergySummaryItems) {
            allergySummaryItems.innerHTML = '<div class="empty-state">No allergies specified</div>';
        }
        
        // Set total to $0.00
        if (summaryTotalPrice) {
            summaryTotalPrice.textContent = '$0.00';
        }
    }

    // Toggle food customization sections based on selected food type
    function toggleFoodOptionsSection() {
        // Hide all customization sections first
        if (sushiOptions) sushiOptions.classList.add('hidden');
        if (hotChipsOptions) hotChipsOptions.classList.add('hidden');
        if (sausageRollOptions) sausageRollOptions.classList.add('hidden');
        if (steakPieOptions) steakPieOptions.classList.add('hidden');
        if (chickenSaladRollOptions) chickenSaladRollOptions.classList.add('hidden');
        if (ricePaperRollsOptions) ricePaperRollsOptions.classList.add('hidden');
        
        // Show the relevant section based on the selected food type
        switch (selectedFoodType) {
            case 'sushi':
                if (sushiOptions) sushiOptions.classList.remove('hidden');
                break;
            case 'hotChips':
                if (hotChipsOptions) hotChipsOptions.classList.remove('hidden');
                break;
            case 'sausageRoll':
                if (sausageRollOptions) sausageRollOptions.classList.remove('hidden');
                break;
            case 'steakPie':
                if (steakPieOptions) steakPieOptions.classList.remove('hidden');
                break;
            case 'chickenSaladRoll':
                if (chickenSaladRollOptions) chickenSaladRollOptions.classList.remove('hidden');
                break;
            case 'ricePaperRolls':
                if (ricePaperRollsOptions) ricePaperRollsOptions.classList.remove('hidden');
                break;
        }
    }

    // Toggle Topping Selection
    function toggleTopping(topping, category = 'sushiVege') {
        if (category === 'sushiVege') {
            if (selectedToppings.includes(topping)) {
                selectedToppings = selectedToppings.filter(t => t !== topping);
            } else {
                // Only add if we haven't reached the max of 2
                if (selectedToppings.length < 2) {
                    selectedToppings.push(topping);
                }
            }
        } else if (category === 'rollExtras') {
            if (selectedRollExtras.includes(topping)) {
                selectedRollExtras = selectedRollExtras.filter(t => t !== topping);
            } else {
                // Only add if we haven't reached the max of 2
                if (selectedRollExtras.length < 2) {
                    selectedRollExtras.push(topping);
                }
            }
        }
        
        updateUI();
        updateOrderSummary();
    }

    // Toggle Allergy Selection
    function toggleAllergy(allergy) {
        if (selectedAllergies.includes(allergy)) {
            selectedAllergies = selectedAllergies.filter(a => a !== allergy);
        } else {
            selectedAllergies.push(allergy);
        }
        
        updateUI();
        updateOrderSummary();
    }

    // Update Quantity
    function updateQuantity(item, quantity) {
        quantities[item] = quantity;
        updateOrderSummary();
    }

    // Remove item from order summary
    function removeItem(itemId) {
        // Handle removing base food items
        if (itemId.startsWith("base-")) {
            // Extract the food type from the itemId
            const foodType = itemId.substring(5); // Remove "base-" prefix
            
            // Uncheck the corresponding food type checkbox
            const foodCheckbox = document.querySelector(`input[name="foodType"][value="${foodType}"]`);
            if (foodCheckbox) {
                foodCheckbox.checked = false;
            }
            
            // Remove from selectedFoodTypes array
            selectedFoodTypes = selectedFoodTypes.filter(type => type !== foodType);
            
            // Update selectedFoodType if needed
            if (selectedFoodTypes.length > 0) {
                selectedFoodType = selectedFoodTypes[selectedFoodTypes.length - 1];
            } else {
                selectedFoodType = '';
            }
            
            // Update the UI and order summary
            updateUI();
            updateOrderSummary();
            return;
        } else if (itemId.startsWith("protein-")) {
            // Reset to default protein
            selectedProtein = "chickenKatsu";
            const proteinRadio = document.querySelector('input[name="sushiProtein"][value="chickenKatsu"]');
            if (proteinRadio) proteinRadio.checked = true;
        } else if (itemId.startsWith("topping-")) {
            const topping = itemId.split('-')[1];
            selectedToppings = selectedToppings.filter(t => t !== topping);
            const toppingCheckbox = document.querySelector(`input[name="sushiVege"][value="${topping}"]`);
            if (toppingCheckbox) toppingCheckbox.checked = false;
        } else if (itemId.startsWith("extra-")) {
            const extra = itemId.split('-')[1];
            selectedRollExtras = selectedRollExtras.filter(e => e !== extra);
            const extraCheckbox = document.querySelector(`input[name="rollExtras"][value="${extra}"]`);
            if (extraCheckbox) extraCheckbox.checked = false;
        } else if (itemId.startsWith("rice-")) {
            // Reset to default rice
            selectedRiceType = "white";
            const riceRadio = document.querySelector('input[name="riceType"][value="white"]');
            if (riceRadio) riceRadio.checked = true;
        } else if (itemId.startsWith("bread-")) {
            // Reset to default bread
            selectedBreadType = "white";
            const breadRadio = document.querySelector('input[name="breadType"][value="white"]');
            if (breadRadio) breadRadio.checked = true;
        } else if (itemId.startsWith("sauce-")) {
            // Reset to no sauce
            selectedSauce = "none";
            const sauceRadio = document.querySelector('input[name="sauce"][value="none"]');
            if (sauceRadio) sauceRadio.checked = true;
        } else if (itemId.startsWith("combo-")) {
            // Reset combo selection
            comboSelected = false;
            const comboCheckbox = document.querySelector('input[name="comboOption"]');
            if (comboCheckbox) comboCheckbox.checked = false;
            
            // Reset drink selection only if no explicit drink was selected
            if (selectedDrink === "softDrink" || selectedDrink === "water") {
                selectedDrink = "none";
                const drinkRadio = document.querySelector('input[name="drink"][value="none"]');
                if (drinkRadio) drinkRadio.checked = true;
            }
        } else if (itemId.startsWith("drink-")) {
            // Reset to no drink
            selectedDrink = "none";
            const drinkRadio = document.querySelector('input[name="drink"][value="none"]');
            if (drinkRadio) drinkRadio.checked = true;
            
            // Hide coffee options if applicable
            if (coffeeOptions) coffeeOptions.classList.add('hidden');
        } else if (itemId.startsWith("coffeeSize-")) {
            // Reset to regular size
            coffeeSize = "regular";
            const sizeRadio = document.querySelector('input[name="coffeeSize"][value="regular"]');
            if (sizeRadio) sizeRadio.checked = true;
        } else if (itemId.startsWith("coffeeMilk-")) {
            // Reset to regular milk
            coffeeMilk = "regular";
            const milkRadio = document.querySelector('input[name="coffeeMilk"][value="regular"]');
            if (milkRadio) milkRadio.checked = true;
        } else if (itemId.startsWith("chipSize-")) {
            // Reset to regular size
            selectedChipSize = "regular";
            const chipSizeRadio = document.querySelector('input[name="chipSize"][value="regular"]');
            if (chipSizeRadio) chipSizeRadio.checked = true;
        } else if (itemId.startsWith("sausageType-")) {
            // Reset to regular type
            selectedSausageType = "regular";
            const sausageTypeRadio = document.querySelector('input[name="sausageType"][value="regular"]');
            if (sausageTypeRadio) sausageTypeRadio.checked = true;
        } else if (itemId.startsWith("pieType-")) {
            // Reset to regular type
            selectedPieType = "regular";
            const pieTypeRadio = document.querySelector('input[name="pieType"][value="regular"]');
            if (pieTypeRadio) pieTypeRadio.checked = true;
        } else if (itemId.startsWith("ricePaperQuantity-")) {
            // Reset to two rolls
            selectedRicePaperQuantity = "two";
            const quantityRadio = document.querySelector('input[name="ricePaperQuantity"][value="two"]');
            if (quantityRadio) quantityRadio.checked = true;
        } else if (itemId.startsWith("allergy-")) {
            const allergy = itemId.split('-')[1];
            selectedAllergies = selectedAllergies.filter(a => a !== allergy);
            const allergyCheckbox = document.querySelector(`input[name="allergies"][value="${allergy}"]`);
            if (allergyCheckbox) allergyCheckbox.checked = false;
        }
        
        updateUI();
        updateOrderSummary();
    }

    // Generate summary item HTML
    function generateSummaryItem(name, type, price, icon, itemId, quantity = 1) {
        const totalPrice = price * quantity;
        const quantityDisplay = quantity > 1 ? ` (${quantity}x)` : '';
        
        return `
            <div class="summary-item" data-item-id="${itemId}">
                <div class="item-details">
                    <div class="item-name"><i class="fas fa-${icon}"></i> ${name}${quantityDisplay}</div>
                    <div class="item-options">${type}</div>
                </div>
                <div class="actions">
                    <span>${formatPrice(totalPrice)}</span>
                    <button type="button" class="remove-item" data-item-id="${itemId}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Update Order Summary
    function updateOrderSummary() {
        const foodSummaryHTML = [];
        const drinkSummaryHTML = [];
        const allergySummaryHTML = [];
        let total = 0;

        // Check if we have any selected food types
        if (selectedFoodTypes.length === 0) {
            // No food items selected, show empty state
            if (foodSummaryItems) {
                foodSummaryItems.innerHTML = '<div class="empty-state">No food items added yet</div>';
            }
        } else {
            // Add each selected food type to the summary
            selectedFoodTypes.forEach(foodType => {
                let basePrice = 0;
                let baseName = '';
                let baseIcon = '';
                let baseId = '';
                
                // Get food item details based on type
                switch (foodType) {
                    case 'sushi':
                        basePrice = calculateItemPrice("sushi");
                        baseName = "Sushi Roll";
                        baseIcon = "fish";
                        baseId = "base-sushi";
                        break;
                    case 'sausageRoll':
                        basePrice = calculateItemPrice("sausageRoll");
                        baseName = "Sausage Roll";
                        baseIcon = "hotdog";
                        baseId = "base-sausageRoll";
                        break;
                    case 'hotChips':
                        basePrice = calculateItemPrice("hotChips");
                        baseName = "Hot Chips";
                        baseIcon = "french-fries";
                        baseId = "base-hotChips";
                        break;
                    case 'steakPie':
                        basePrice = calculateItemPrice("steakPie");
                        baseName = "Chunky Steak Pie";
                        baseIcon = "pie";
                        baseId = "base-steakPie";
                        break;
                    case 'chickenSaladRoll':
                        basePrice = calculateItemPrice("chickenSaladRoll");
                        baseName = "Chicken Salad Roll";
                        baseIcon = "bread-slice";
                        baseId = "base-chickenSaladRoll";
                        break;
                    case 'ricePaperRolls':
                        basePrice = calculateItemPrice("ricePaperRolls");
                        baseName = "Rice Paper Rolls";
                        baseIcon = "scroll";
                        baseId = "base-ricePaperRolls";
                        break;
                }
                
                // Get the quantity for this food item
                const qtyInput = document.querySelector(`input[name="foodType"][value="${foodType}"]`)
                    .closest('.checkbox-container')
                    .querySelector('.qty-input');
                const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
                
                // Calculate total price for this food item
                const itemTotalPrice = basePrice * quantity;
                total += itemTotalPrice;
                
                // Add to food summary HTML
                foodSummaryHTML.push(
                    generateSummaryItem(
                        baseName,
                        "Base Item",
                        basePrice,
                        baseIcon,
                        `base-${foodType}`,
                        quantity
                    )
                );
            });
        }

        // Add food-specific customizations
        if (selectedFoodType === 'sushi') {
            // Add protein
            if (selectedProtein) {
                const proteinQty = quantities[selectedProtein];
                const proteinPrice = calculateItemPrice(selectedProtein, 1);
                const totalProteinPrice = proteinPrice * proteinQty;
                
                if (proteinPrice > 0 || selectedProtein === "chickenKatsu") {
                    total += totalProteinPrice;
                    
                    let proteinName = "";
                    let proteinIcon = "drumstick-bite";
                    
                    if (selectedProtein === "chickenKatsu") {
                        proteinName = "Chicken Katsu";
                    } else if (selectedProtein === "tunaSalad") {
                        proteinName = "Tuna Salad";
                        proteinIcon = "fish";
                    } else if (selectedProtein === "spicyPrawn") {
                        proteinName = "Spicy Prawn";
                        proteinIcon = "fish";
                    }
                    
                    foodSummaryHTML.push(
                        generateSummaryItem(
                            proteinName,
                            "Protein",
                            proteinPrice,
                            proteinIcon,
                            `protein-${selectedProtein}`,
                            proteinQty
                        )
                    );
                }
            }

            // Add toppings
            selectedToppings.forEach(topping => {
                const toppingQty = quantities[topping];
                const toppingPrice = calculateItemPrice(topping, 1);
                const totalToppingPrice = toppingPrice * toppingQty;
                
                total += totalToppingPrice;
                
                const toppingName = topping.charAt(0).toUpperCase() + topping.slice(1);
                const toppingIcon = topping === "carrot" ? "carrot" : "seedling";
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        toppingName,
                        "Topping",
                        toppingPrice,
                        toppingIcon,
                        `topping-${topping}`,
                        toppingQty
                    )
                );
            });

            // Add rice type
            if (selectedRiceType) {
                const riceQty = quantities[`${selectedRiceType}Rice`];
                const ricePrice = calculateItemPrice(selectedRiceType, 1);
                const totalRicePrice = ricePrice * riceQty;
                
                if (ricePrice > 0 || selectedRiceType === "brown") {
                    total += totalRicePrice;
                    const riceName = selectedRiceType.charAt(0).toUpperCase() + selectedRiceType.slice(1) + " Rice";
                    
                    foodSummaryHTML.push(
                        generateSummaryItem(
                            riceName,
                            "Rice Type",
                            ricePrice,
                            "bowl-rice",
                            `rice-${selectedRiceType}`,
                            riceQty
                        )
                    );
                }
            }
        } else if (selectedFoodType === 'hotChips') {
            // Add chip size
            if (selectedChipSize === 'large') {
                const sizePrice = calculateItemPrice('large');
                total += sizePrice;
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        "Large Size",
                        "Size Upgrade",
                        sizePrice,
                        "box",
                        `chipSize-${selectedChipSize}`
                    )
                );
            }
        } else if (selectedFoodType === 'sausageRoll') {
            // Add sausage type
            if (selectedSausageType === 'spicy') {
                const typePrice = calculateItemPrice('spicy');
                total += typePrice;
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        "Spicy",
                        "Type",
                        typePrice,
                        "fire",
                        `sausageType-${selectedSausageType}`
                    )
                );
            }
        } else if (selectedFoodType === 'steakPie') {
            // Add pie type
            if (selectedPieType === 'mushroom') {
                const typePrice = calculateItemPrice('mushroom');
                total += typePrice;
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        "With Mushroom",
                        "Type",
                        typePrice,
                        "mushroom",
                        `pieType-${selectedPieType}`
                    )
                );
            }
        } else if (selectedFoodType === 'chickenSaladRoll') {
            // Add bread type
            if (selectedBreadType !== 'white') {
                const breadPrice = calculateItemPrice(selectedBreadType);
                total += breadPrice;
                
                const breadName = selectedBreadType === 'wholemeal' ? 'Wholemeal Bread' : 'Gluten Free Bread';
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        breadName,
                        "Bread Type",
                        breadPrice,
                        "bread-slice",
                        `bread-${selectedBreadType}`
                    )
                );
            }
            
            // Add extras
            selectedRollExtras.forEach(extra => {
                const extraQty = quantities[extra] || 1;
                const extraPrice = calculateItemPrice(extra, 1);
                const totalExtraPrice = extraPrice * extraQty;
                
                total += totalExtraPrice;
                
                let extraName = extra.charAt(0).toUpperCase() + extra.slice(1);
                let extraIcon = extra === "cheese" ? "cheese" : (extra === "egg" ? "egg" : "seedling");
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        extraName,
                        "Extra",
                        extraPrice,
                        extraIcon,
                        `extra-${extra}`,
                        extraQty
                    )
                );
            });
        } else if (selectedFoodType === 'ricePaperRolls') {
            // Add quantity option
            if (selectedRicePaperQuantity === 'four') {
                const quantityPrice = calculateItemPrice('four');
                total += quantityPrice;
                
                foodSummaryHTML.push(
                    generateSummaryItem(
                        "4 Rolls",
                        "Quantity",
                        quantityPrice,
                        "scroll",
                        `ricePaperQuantity-${selectedRicePaperQuantity}`
                    )
                );
            }
        }

        // Add sauce
        if (selectedSauce && selectedSauce !== "none") {
            const saucePrice = calculateItemPrice(selectedSauce);
            total += saucePrice;
            
            const sauceName = selectedSauce.charAt(0).toUpperCase() + selectedSauce.slice(1) + " Sauce";
            
            foodSummaryHTML.push(
                generateSummaryItem(
                    sauceName,
                    "Sauce",
                    saucePrice,
                    "droplet",
                    `sauce-${selectedSauce}`
                )
            );
        }

        // Add combo
        if (comboSelected) {
            const comboPrice = calculateItemPrice("combo");
            total += comboPrice;
            
            foodSummaryHTML.push(
                generateSummaryItem(
                    "Hot Chips + Drink Combo",
                    "Combo Deal",
                    comboPrice,
                    "utensils",
                    `combo-combo`
                )
            );
        }

        // Add drink
        if (selectedDrink && selectedDrink !== "none") {
            const drinkQty = quantities[selectedDrink];
            const drinkPrice = calculateItemPrice(selectedDrink, 1);
            const totalDrinkPrice = drinkPrice * drinkQty;
            
            if (comboSelected) {
                // If it's part of a combo, don't add the price again
                let drinkName = "";
                let drinkIcon = "";
                
                if (selectedDrink === "softDrink") {
                    drinkName = "Soft Drink";
                    drinkIcon = "glass";
                } else if (selectedDrink === "water") {
                    drinkName = "Water";
                    drinkIcon = "glass-water";
                } else if (selectedDrink === "coffee") {
                    drinkName = "Coffee";
                    drinkIcon = "mug-hot";
                    
                    // For coffee in a combo, add the price difference
                    if (selectedDrink === "coffee") {
                        const coffeeUpgradePrice = 1.50;
                        total += coffeeUpgradePrice;
                    }
                }
                
                drinkSummaryHTML.push(
                    generateSummaryItem(
                        drinkName,
                        "Combo Drink",
                        0, // Part of combo, so price is 0
                        drinkIcon,
                        `drink-${selectedDrink}`,
                        drinkQty
                    )
                );
            } else {
                // If not part of a combo, add the full price
                total += totalDrinkPrice;
                
                let drinkName = "";
                let drinkIcon = "";
                
                if (selectedDrink === "softDrink") {
                    drinkName = "Soft Drink";
                    drinkIcon = "glass";
                } else if (selectedDrink === "water") {
                    drinkName = "Water";
                    drinkIcon = "glass-water";
                } else if (selectedDrink === "coffee") {
                    drinkName = "Coffee";
                    drinkIcon = "mug-hot";
                }
                
                drinkSummaryHTML.push(
                    generateSummaryItem(
                        drinkName,
                        "Drink",
                        drinkPrice,
                        drinkIcon,
                        `drink-${selectedDrink}`,
                        drinkQty
                    )
                );
            }
            
            // Add coffee customizations
            if (selectedDrink === "coffee") {
                // Add coffee size
                if (coffeeSize === "large") {
                    const sizePrice = calculateItemPrice("large");
                    total += sizePrice;
                    
                    drinkSummaryHTML.push(
                        generateSummaryItem(
                            "Large Size",
                            "Coffee Size",
                            sizePrice,
                            "mug-hot",
                            `coffeeSize-${coffeeSize}`
                        )
                    );
                }
                
                // Add coffee milk
                if (coffeeMilk !== "regular") {
                    const milkPrice = calculateItemPrice(coffeeMilk);
                    total += milkPrice;
                    
                    const milkName = coffeeMilk === "soyMilk" ? "Soy Milk" : "Oat Milk";
                    
                    drinkSummaryHTML.push(
                        generateSummaryItem(
                            milkName,
                            "Milk Type",
                            milkPrice,
                            "milk",
                            `coffeeMilk-${coffeeMilk}`
                        )
                    );
                }
            }
        }

        // Add allergies to summary
        if (selectedAllergies.length > 0) {
            selectedAllergies.forEach(allergy => {
                const allergyName = allergy.charAt(0).toUpperCase() + allergy.slice(1);
                
                allergySummaryHTML.push(
                    generateSummaryItem(
                        allergyName,
                        "Allergy",
                        0, // Allergies don't affect price
                        "exclamation-circle",
                        `allergy-${allergy}`
                    )
                );
            });
        }
        
        // Add allergy notes if any
        if (allergyNotes.value.trim()) {
            allergySummaryHTML.push(`
                <div class="summary-item">
                    <div class="item-details">
                        <div class="item-name"><i class="fas fa-comment"></i> Additional Notes</div>
                        <div class="item-options">${allergyNotes.value}</div>
                    </div>
                </div>
            `);
        }

        // Update the summary sections
        if (foodSummaryHTML.length > 0) {
            foodSummaryItems.innerHTML = foodSummaryHTML.join('');
        } else {
            foodSummaryItems.innerHTML = '<div class="empty-state">No food items added yet</div>';
        }
        
        if (drinkSummaryHTML.length > 0) {
            drinkSummaryItems.innerHTML = drinkSummaryHTML.join('');
        } else {
            drinkSummaryItems.innerHTML = '<div class="empty-state">No drinks added yet</div>';
        }
        
        if (allergySummaryHTML.length > 0) {
            allergySummaryItems.innerHTML = allergySummaryHTML.join('');
        } else {
            allergySummaryItems.innerHTML = '<div class="empty-state">No allergies specified</div>';
        }
        
        // Update the total price
        summaryTotalPrice.textContent = formatPrice(total);
    }

    // Update UI based on current selections
    function updateUI() {
        // Update food type checkboxes
        foodTypeInputs.forEach(input => {
            const container = input.closest('.checkbox-container');
            if (input.checked) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Toggle food options sections based on selected food type
        toggleFoodOptionsSection();
        
        // Update protein radio buttons
        document.querySelectorAll('input[name="sushiProtein"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedProtein = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update rice type radio buttons
        document.querySelectorAll('input[name="riceType"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedRiceType = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update chips size radio buttons
        document.querySelectorAll('input[name="chipSize"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedChipSize = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update sausage type radio buttons
        document.querySelectorAll('input[name="sausageType"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedSausageType = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update pie type radio buttons
        document.querySelectorAll('input[name="pieType"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedPieType = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update bread type radio buttons
        document.querySelectorAll('input[name="breadType"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedBreadType = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update rice paper quantity radio buttons
        document.querySelectorAll('input[name="ricePaperQuantity"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedRicePaperQuantity = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update vegetable toppings checkboxes
        document.querySelectorAll('input[name="sushiVege"]').forEach(input => {
            const container = input.closest('.checkbox-container');
            if (input.checked) {
                container.classList.add('selected');
                if (!selectedToppings.includes(input.value)) {
                    toggleTopping(input.value);
                }
            } else {
                container.classList.remove('selected');
                if (selectedToppings.includes(input.value)) {
                    toggleTopping(input.value);
                }
            }
        });
        
        // Update roll extras checkboxes
        document.querySelectorAll('input[name="rollExtras"]').forEach(input => {
            const container = input.closest('.checkbox-container');
            if (input.checked) {
                container.classList.add('selected');
                if (!selectedRollExtras.includes(input.value)) {
                    toggleTopping(input.value, 'rollExtras');
                }
            } else {
                container.classList.remove('selected');
                if (selectedRollExtras.includes(input.value)) {
                    toggleTopping(input.value, 'rollExtras');
                }
            }
        });
        
        // Update sauce radio buttons
        document.querySelectorAll('input[name="sauce"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedSauce = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update combo checkbox
        const comboCheckbox = document.querySelector('input[name="comboOption"]');
        if (comboCheckbox) {
            const container = comboCheckbox.closest('.checkbox-container');
            comboSelected = comboCheckbox.checked;
            
            if (comboSelected) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
                
                // If combo is deselected, reset drink to none only if it's already selected
                // but don't force it to none if user explicitly selected a drink
                if (selectedDrink === "none") {
                    const noDrinkRadio = document.querySelector('input[name="drink"][value="none"]');
                    if (noDrinkRadio) noDrinkRadio.checked = true;
                }
            }
            
            // Always ensure drink options are visible
            const drinkOptions = document.getElementById('drinkOptions');
            if (drinkOptions) drinkOptions.classList.remove('hidden');
        }
        
        // Update drink radio buttons
        document.querySelectorAll('input[name="drink"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                selectedDrink = input.value;
                
                // Show coffee options if coffee is selected
                if (input.value === 'coffee') {
                    if (coffeeOptions) coffeeOptions.classList.remove('hidden');
                } else {
                    if (coffeeOptions) coffeeOptions.classList.add('hidden');
                }
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update coffee size radio buttons
        document.querySelectorAll('input[name="coffeeSize"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                coffeeSize = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update coffee milk radio buttons
        document.querySelectorAll('input[name="coffeeMilk"]').forEach(input => {
            const container = input.closest('.radio-container');
            if (input.checked) {
                container.classList.add('selected');
                coffeeMilk = input.value;
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Update allergy checkboxes
        document.querySelectorAll('input[name="allergies"]').forEach(input => {
            const container = input.closest('.checkbox-container');
            if (input.checked) {
                container.classList.add('selected');
                if (!selectedAllergies.includes(input.value)) {
                    toggleAllergy(input.value);
                }
            } else {
                container.classList.remove('selected');
                if (selectedAllergies.includes(input.value)) {
                    toggleAllergy(input.value);
                }
            }
        });
    }

    // Event listeners for quantity controls
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-dec')) {
            const qtyInput = e.target.parentElement.querySelector('.qty-input');
            const item = e.target.parentElement.dataset.item;
            let qty = parseInt(qtyInput.value);
            if (qty > 1) {
                qty--;
                qtyInput.value = qty;
                updateQuantity(item, qty);
            }
        } else if (e.target.classList.contains('qty-inc')) {
            const qtyInput = e.target.parentElement.querySelector('.qty-input');
            const item = e.target.parentElement.dataset.item;
            let qty = parseInt(qtyInput.value);
            if (qty < 5) {
                qty++;
                qtyInput.value = qty;
                updateQuantity(item, qty);
            }
        }
    });

    // Event listeners for food type selection
    foodTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
                // For checkbox-based food selection
            if (input.checked) {
                // Add to selectedFoodTypes array if not already included
                if (!selectedFoodTypes.includes(input.value)) {
                    selectedFoodTypes.push(input.value);
                }
                
                // Show customization options for the last selected food
                selectedFoodType = input.value;
                toggleFoodOptionsSection();
            } else {
                // Remove from selectedFoodTypes array
                selectedFoodTypes = selectedFoodTypes.filter(type => type !== input.value);
                
                // If any food type is still selected, update selectedFoodType
                if (selectedFoodTypes.length > 0) {
                    selectedFoodType = selectedFoodTypes[selectedFoodTypes.length - 1];
                    toggleFoodOptionsSection();
                } else {
                    // Hide all customization sections if no food type is selected
                    selectedFoodType = '';
                    if (sushiOptions) sushiOptions.classList.add('hidden');
                    if (hotChipsOptions) hotChipsOptions.classList.add('hidden');
                    if (sausageRollOptions) sausageRollOptions.classList.add('hidden');
                    if (steakPieOptions) steakPieOptions.classList.add('hidden');
                    if (chickenSaladRollOptions) chickenSaladRollOptions.classList.add('hidden');
                    if (ricePaperRollsOptions) ricePaperRollsOptions.classList.add('hidden');
                }
            }
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for protein selection
    document.querySelectorAll('input[name="sushiProtein"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for rice type selection
    document.querySelectorAll('input[name="riceType"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for chips size selection
    document.querySelectorAll('input[name="chipSize"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for sausage type selection
    document.querySelectorAll('input[name="sausageType"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for pie type selection
    document.querySelectorAll('input[name="pieType"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for bread type selection
    document.querySelectorAll('input[name="breadType"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for rice paper quantity selection
    document.querySelectorAll('input[name="ricePaperQuantity"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for toppings selection
    document.querySelectorAll('input[name="sushiVege"]').forEach(input => {
        input.addEventListener('change', () => {
            const maxSelect = parseInt(input.dataset.maxSelect);
            const checked = document.querySelectorAll('input[name="sushiVege"]:checked').length;
            
            if (checked > maxSelect) {
                input.checked = false;
                alert(`You can only select up to ${maxSelect} toppings.`);
            } else {
                updateUI();
                updateOrderSummary();
            }
        });
    });

    // Event listeners for roll extras selection
    document.querySelectorAll('input[name="rollExtras"]').forEach(input => {
        input.addEventListener('change', () => {
            const maxSelect = parseInt(input.dataset.maxSelect);
            const checked = document.querySelectorAll('input[name="rollExtras"]:checked').length;
            
            if (checked > maxSelect) {
                input.checked = false;
                alert(`You can only select up to ${maxSelect} extras.`);
            } else {
                updateUI();
                updateOrderSummary();
            }
        });
    });

    // Event listeners for sauce selection
    document.querySelectorAll('input[name="sauce"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listener for combo selection
    const comboCheckbox = document.querySelector('input[name="comboOption"]');
    if (comboCheckbox) {
        comboCheckbox.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    }

    // Event listeners for drink selection
    document.querySelectorAll('input[name="drink"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for coffee size selection
    document.querySelectorAll('input[name="coffeeSize"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for coffee milk selection
    document.querySelectorAll('input[name="coffeeMilk"]').forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listeners for allergy selection
    allergyInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateUI();
            updateOrderSummary();
        });
    });

    // Event listener for allergy notes
    allergyNotes.addEventListener('input', () => {
        updateOrderSummary();
    });

    // Event listeners for customer name input
    customerNameInput.addEventListener('input', () => {
        customerName = customerNameInput.value;
    });

    // Event listener for removing items from summary
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('remove-item'))) {
            const itemId = e.target.dataset.itemId || e.target.parentElement.dataset.itemId;
            removeItem(itemId);
        }
    });

    // Event listener for Add to Order button
    const addToOrderBtn = document.getElementById('addToOrderBtn');
    if (addToOrderBtn) {
        addToOrderBtn.addEventListener('click', () => {
            updateOrderSummary();
        });
    }

    // Event listener for Submit Order button
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', () => {
            // Check if customer name is provided
            if (!customerName.trim()) {
                alert('Please enter your name to place an order.');
                customerNameInput.focus();
                return;
            }
            
            // Get the total price
            const totalPrice = summaryTotalPrice.textContent;
            
            // Create order success popup
            const orderSuccess = document.createElement('div');
            orderSuccess.className = 'order-success';
            orderSuccess.innerHTML = `
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you, ${customerName}! Your order has been received.</p>
                <p>We'll prepare your order right away.</p>
                <div class="total">Total: ${totalPrice}</div>
                <button id="closeSuccessBtn">Close</button>
            `;
            
            document.body.appendChild(orderSuccess);
            
            // Event listener for closing success popup
            const closeSuccessBtn = document.getElementById('closeSuccessBtn');
            if (closeSuccessBtn) {
                closeSuccessBtn.addEventListener('click', () => {
                    orderSuccess.remove();
                    
                    // Reset the form
                    form.reset();
                    selectedToppings = [];
                    selectedRollExtras = [];
                    selectedAllergies = [];
                    initializeForm();
                });
            }
        });
    }

    // Initialize the form on page load
    initializeForm();
});
