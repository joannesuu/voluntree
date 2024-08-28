function openPopup(url) {
    var width = 600;
    var height = 400;
    var left = (window.innerWidth - width) / 2;
    var top = (window.innerHeight - height) / 2;

    window.open(url, '_blank', 'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top);
  }
