import React from 'react';
import ReactDOM from 'react-dom';
import Lightbox from 'react-images';
import _ from 'lodash';

var Gallery = React.createClass({
    displayName: 'Gallery',
    getInitialState: function(){
        return {
	    currentImage: 0,
	    containerWidth: 0
	}
    },
    componentDidMount: function(){
        this.setState({containerWidth: ReactDOM.findDOMNode(this).clientWidth});
        this.handleResize = _.debounce(this.handleResize, 400);
        window.addEventListener('resize', this.handleResize);
    },
    handleResize: function(e){
        this.setState({containerWidth: ReactDOM.findDOMNode(this).clientWidth});
    },
    openLightbox (index, event) {
        event.preventDefault();
        this.setState({
	    currentImage: index,
            lightboxIsOpen: true
        });
    },
    closeLightbox () {
        this.setState({
	    currentImage: 0,
            lightboxIsOpen: false,
        });
    },
    gotoPrevious () {
	this.setState({
	    currentImage: this.state.currentImage - 1,
	});
    },
    gotoNext () {
	this.setState({
	    currentImage: this.state.currentImage + 1,
	});
    },
    render: function(){
	// manipulate height and width data before creating PhotoPreview nodes
        var rowLimit = 1,
            contWidth = this.state.containerWidth - (rowLimit * 4) /* 4px for margin around each image*/,
            photoPreviewNodes = [];
            // calculate the right photo index to start looping thru based on the page
            // i dont think i need photoNum because its only looping thru NEW images?  im not sure.
            // but might need to change i so it doesnt loop thru the entire list again
        // loop through each rowLimit (nth) node
        if (window.matchMedia('(min-width: 480px)').matches){
            rowLimit = 2;
            contWidth = this.state.containerWidth - (rowLimit * 4); /* 4px for margin around each image*/
        }
        if (window.matchMedia('(min-width: 1024px)').matches){
            rowLimit = 3;
            contWidth = this.state.containerWidth - (rowLimit * 4); /* 4px for margin around each image*/
        }
        contWidth = Math.ceil(contWidth - 2); // subtract a couple pixels for unknown issue where line breaks in certain breakpoints.  this gives container some "padding"
        for (var i=0;i<this.props.photos.length;i+=rowLimit){
            var rowItems = [];
            // loop thru each set of rowLimit num
            // eg. if rowLimit is 3 it will  loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
            var ar=0,
                totalAr=0,
                commonHeight = 0;
            for (var j=i; j<i+rowLimit; j++){
                if (j == this.props.photos.length){
                    break;
                }
		totalAr += this.props.photos[j].ar;
            }
            commonHeight = contWidth / totalAr;
            // run thru the same set of items again to give the common height
            for (var k=i; k<i+rowLimit; k++){
                if (k == this.props.photos.length){
                    break;
                }
                // gallery image
		var src = this.props.photos[k].gallery_src;
                photoPreviewNodes.push(
                     <div key={k} className='PhotoPreview'>
                        <a href="#" className={k} onClick={this.openLightbox.bind(this, k)}><img src={src} height={commonHeight} width={commonHeight * this.props.photos[k].ar} alt="" /></a>
                     </div>
                );
            }
        }
	return(
            <div id="Gallery" className="clearfix">
                {photoPreviewNodes}
                <Lightbox
		    currentImage={this.state.currentImage}
                    images={this.props.photos}
                    isOpen={this.state.lightboxIsOpen}
                    onClose={this.closeLightbox}
		    onClickPrev={this.gotoPrevious}
		    onClickNext={this.gotoNext}
                    width={1600}
                    height={1600}
                    styles={styles}
                />
            </div>
        );

    }

});
const styles = Lightbox.extendStyles({
    backdrop: {
        backgroundColor: 'rgba(0,0,0,1)',
    },
    dialog:{
        maxHeight: '90%'
    }
});
module.exports = Gallery;