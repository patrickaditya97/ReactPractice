import React from 'react';
import SearchBar from './SearchBar'
import ProductTable from './ProductTable'

const { Map, List } = require('immutable');


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