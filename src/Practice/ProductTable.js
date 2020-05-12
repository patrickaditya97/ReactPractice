import React from 'react';
const { Map, List } = require('immutable');


class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }

        this.onInputSearchTermChanged = this.onInputSearchTermChanged.bind(this);
    }

    onInputSearchTermChanged(e) {
        // console.log(e.target.value); 

        this.setState({ inputValue: e.target.value })

        this.props.Search(e.target.value)
    }

    render() {
        return (
            <div style={{ width: 200 + 'px', margin: 'auto' }}>
                <input type="text" name="searchTerm" id="searchTerm" value={this.state.inputValue} onChange={this.onInputSearchTermChanged} /><br />
                <input type="checkbox" id="stockCheck" onClick={this.props.onClickStock} /> In stock items only<br />
            </div>
        )
    }
}

class ProductTable extends React.Component {

    render() {

        let productArr = []

        let inStockItems = this.props.products      //.filter((item) => {

        //     return item.stocked === isStocked && isStocked || !isStocked

        // })

        // inStockItems.map((item, index) => {

        //     productArr.push(
        //         <ProductRow key={index + 1} stocked={item.stocked} name={item.name} price={item.price} />
        //     )
        // })

        let id = 0

        inStockItems.groupBy(item => item.category).entrySeq().forEach(([key, value]) => {
            
            productArr.push(
                <ProductCategory key={id+3/2} category={key}/>
            )
            
            value.toJS().forEach((item) => {
            
                productArr.push(
                    <ProductRow key={id++} stocked={item.stocked} name={item.name} price={item.price} />
                )
            
            })
			
		})


        return (
            <table style={{width: 200+'px', margin: 'auto'}}>
                <thead>
                    <tr>
                        <td>
                            Name
                        </td>
                        <td>
                            Price
                        </td>
                    </tr>
                </thead>

                <tbody>

                    {productArr}

                </tbody>
            </table>
        )
    }
}


class ProductRow extends React.Component {

    render() {
        return (
            <tr>
                <td style={!this.props.stocked ? { color: 'red' } : { color: '' }} >
                    {this.props.name}
                </td>
                <td style={!this.props.stocked ? { color: 'red' } : { color: '' }} >
                    {this.props.price}
                </td>
            </tr>
        );
    }

}


class ProductCategory extends React.Component {

    render() {
        return (
            <tr>
                <td colSpan={2} style={{fontWeight:900, textAlign: 'center'}}>
                    {this.props.category}
                </td>
            </tr>
        );
    }

}



class ProductTableContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            onlyInStock: false,
            PRODUCTS: Map({
                items: List([
                    { category: "Sporting Goods", price: "$49.99", stocked: true, name: "Rugby Ball" },
                    { category: "Sporting Goods", price: "$49.99", stocked: true, name: "Cannon Ball" },
                    { category: "Sporting Goods", price: "$49.99", stocked: false, name: "PingPong Ball" },
                    { category: "Sporting Goods", price: "$49.99", stocked: false, name: "Fitness Ball" },
                    { category: "Sporting Goods", price: "$49.99", stocked: true, name: "PullUp rope" },
                    { category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
                    { category: "Electronics", price: "$99.99", stocked: true, name: "Laptop" },
                    { category: "Electronics", price: "$99.99", stocked: false, name: "IMac" },
                    { category: "Electronics", price: "$99.99", stocked: true, name: "HeadPhones" },
                    { category: "Electronics", price: "$99.99", stocked: false, name: "Google Pixel" },
                    { category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
                    { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" },
                    { category: "Garments", price: "$99.99", stocked: true, name: "Laptop" },
                    { category: "Garments", price: "$99.99", stocked: false, name: "IMac" },
                    { category: "Garments", price: "$99.99", stocked: true, name: "HeadPhones" },
                    { category: "Garments", price: "$99.99", stocked: false, name: "Google Pixel" },
                    { category: "Garments", price: "$399.99", stocked: false, name: "iPhone 5" },
                    { category: "Garments", price: "$199.99", stocked: true, name: "Nexus 7" }
                ])
            }),
            value: ''
        }

        this.showByStock = this.showByStock.bind(this);
        this.enterSearch = this.enterSearch.bind(this);
    }

    showByStock(e) {
        e.preventDefault();

        if (this.state.onlyInStock === false) {
            this.setState({ onlyInStock: true })
        }
        else {
            this.setState({ onlyInStock: false })
        }
    }

    enterSearch(e) {
        // e.preventDefault()
        // console.log(e.target.value)
        let searchValue = e
        this.setState({ value: searchValue })

    }

    render() {

        // const PRODUCTS = Map({
        //     items: List([
        //         { category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football" },
        //         { category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
        //         { category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" },
        //         { category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch" },
        //         { category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
        //         { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }
        //     ])
        // })

        let filteredProducts = this.state.PRODUCTS.getIn(['items'])

        if (this.state.value || this.state.onlyInStock) {

            filteredProducts = this.state.PRODUCTS.getIn(['items']).filter((item) => {
                return (item.name.toLowerCase().indexOf(this.state.value.toLowerCase()) !== -1) && (item.stocked === this.state.onlyInStock || !this.state.onlyInStock)
            })
        }

        return (
            <div>

                <div className="search-bar">
                    <SearchBar onClickStock={this.showByStock} Search={this.enterSearch} value={this.state.value} />
                </div>
                <div className="product-table">
                    <ProductTable inStock={this.state.onlyInStock} products={filteredProducts} />
                </div>

            </div>
        )
    }
}

export default ProductTableContainer