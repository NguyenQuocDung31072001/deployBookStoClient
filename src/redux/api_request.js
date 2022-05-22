import {
  registerStart,
  registerSuccess,
  registerFailed,
  loginStart,
  loginSuccess,
  loginFailed,
  updateCurrentUser,
  logout
} from './auth_slices'
import axios from 'axios'
import {
  addGenre,
  softDeleteUpdate,
  hardDeleteUpdate,
  restoreDeleteUpdate,
  genreError,
  genreLoading,
  initGenresData,
  updateGenreData,
  initDeletedGenresData
} from './genre_slice'
import {
  addAuthor,
  authorError,
  authorLoading,
  hardDeleteAuthorUpdate,
  initAuthorData,
  initDeletedAuthorData,
  restoreDeletedAuthorUpdate,
  softDeleteAuthorUpdate,
  updateAuthorData
} from './author_slice'

const API_URL = 'http://localhost:5000'

export const registerApi = async (user, dispatch) => {
  dispatch(registerStart())
  try {
    const res = await axios.post(
      API_URL + '/v1/selling_e_books/auth/register',
      user
    )
    const data = res.data
    if (data.error) {
      dispatch(registerFailed())
    } else {
      dispatch(registerSuccess())
    }
    return data
  } catch (error) {
    dispatch(registerFailed())
    return { success: false, error: true, data: null }
  }
}

export const loginApi = async (user, dispatch, navigate) => {
  dispatch(loginStart())
  try {
    const res = await axios.post(
      API_URL + '/v1/selling_e_books/auth/login',
      user
    )
    if (res.data.error) {
      dispatch(loginFailed())
      return res.data
    }

    dispatch(loginSuccess(res.data))
    if (res.data.role === 'admin') {
      navigate('/admin/home')
    }
    if (res.data.role === 'user') {
      navigate('/user/home')
    }
  } catch (error) {
    dispatch(loginFailed())
  }
}
export const updateAccountAdmin = async (currentUser, account, dispatch) => {
  try {
    console.log("account",account)
    const res = await axios.post(
      API_URL + '/v1/selling_e_books/account/setting/' + currentUser._id,
      account,
      {
        headers: { token: currentUser.accessToken }
      }
    )

    const payloadAction = {
      ...currentUser,
      email: res.data.email,
      username: res.data.username,
      password: res.data.password,
      id_avatar: res.data.id_avatar,
      avatar_url: res.data.avatar_url,
      phoneNumber: res.data.phoneNumber,
      birthDate: res.data.birthDate,
      address: res.data.address
    }
    console.log(payloadAction)
    dispatch(updateCurrentUser(payloadAction))
  } catch (error) {
    console.log(error)
  }
}

export const updateAccountPassword = async (currentUser, account, dispatch) => {
  try {
    const res = await axios.post(
      API_URL +
        '/v1/selling_e_books/account/setting/' +
        currentUser._id +
        '/password',
      account,
      {
        headers: { token: currentUser.accessToken }
      }
    )
    return res.data
    // if (res.status === 200) dispatch(logout())
  } catch (error) {
    console.log(error)
  }
}

export const getAllBook = async () => {
  try {
    const res = await axios.get(API_URL + '/v1/selling_e_books/book')
    // console.log(res.data.books)
    return res.data.books
  } catch (error) {
    console.log(error)
  }
}
export const getBookOfGenres = async genres => {
  try {
    const res = await axios.get(
      API_URL + `/v1/selling_e_books/genre/${genres}/books`
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getBookOfAuthors = async authors => {
  try {
    const res = await axios.get(
      API_URL + `/v1/selling_e_books/author/${authors}/books`
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const addBook = async new_book => {
  try {
    const res = await axios.post(API_URL + '/v1/selling_e_books/book', new_book)
    const payloadAction = {
      name: res.name,
      description: res.description
    }
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}
export const updateBook = async new_book => {
  try {
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/book/' + new_book.id,
      new_book
    )

    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getAllGenresForAddBook = async () => {
  try {
    const res = await axios.get(API_URL + '/v1/selling_e_books/genre')

    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getAllAuthorForAddBook = async () => {
  try {
    const res = await axios.get(API_URL + '/v1/selling_e_books/author')
    return res.data
  } catch (error) {
    console.log(error)
  }
}
//Genre API
export const getAllGenres = async dispatch => {
  try {
    dispatch(genreLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/genre')
    dispatch(initGenresData(res.data))
    return res
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const getDeletedGenres = async dispatch => {
  try {
    dispatch(genreLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/genre/delete')
    dispatch(initDeletedGenresData(res.data))
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const createNewGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.post(API_URL + '/v1/selling_e_books/genre', genre)
    dispatch(addGenre(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const updateGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/genre/' + genre._id,
      genre
    )
    dispatch(updateGenreData(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const softDeleteGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/genre/' + genre._id
    )
    console.log(res.data)
    dispatch(softDeleteUpdate(genre))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const hardDeleteGenre = async (dispatch, genre) => {
  try {
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/genre/delete/' + genre._id
    )
    console.log(res.data)
    dispatch(hardDeleteUpdate(genre))
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const restoreDeletedGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/genre/restore/' + genre._id
    )
    console.log(res.data)
    dispatch(restoreDeleteUpdate(genre))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const getAllAuthor = async dispatch => {
  try {
    dispatch(authorLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/author')
    dispatch(initAuthorData(res.data))
  } catch (error) {
    console.log(error)
  }
}

export const getDeletedAuthor = async dispatch => {
  try {
    dispatch(authorLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/author/delete')
    dispatch(initDeletedAuthorData(res.data))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const createNewAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.post(API_URL + '/v1/selling_e_books/author', author)
    dispatch(addAuthor(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const updateAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    console.log(author)
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/author/' + author._id,
      author
    )
    dispatch(updateAuthorData(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const softDeleteAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/author/' + author._id
    )
    dispatch(softDeleteAuthorUpdate(res.data))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const hardDeleteAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/author/delete/' + author._id
    )
    console.log(res.data)
    dispatch(hardDeleteAuthorUpdate(author))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const restoreDeletedAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/author/restore/' + author._id
    )
    console.log(res.data)
    dispatch(restoreDeletedAuthorUpdate(res.data))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const getBook = async slug => {
  // console.log('slug ',slug)
  try {
    const res = await axios.get(
      API_URL + '/v1/selling_e_books/book/' + slug,
      {}
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const addBookToCart = async data => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/account/${data.account}/cart`,
      data
    )
    console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getProvinceData = async () => {
  try {
    const res = await axios.get(
      API_URL + `/v1/selling_e_books/shipping/province`
    )
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getDistrictData = async province => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/shipping/district`,
      { province: province }
    )
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getWardData = async district => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/shipping/ward`,
      {
        district: district
      }
    )
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getCart = async id_account => {
  try {
    const res = await axios.get(
      API_URL + `/v1/selling_e_books/account/${id_account}/cart`,
      {}
    )

    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const deleteCart = async (id_account, id_book) => {
  try {
    const res = await axios.delete(
      API_URL + `/v1/selling_e_books/account/${id_account}/cart`,
      {
        data: {
          account: id_account,
          book: id_book,
          deleteBook: true
        }
      }
    )
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const decreaseCart = async (id_account, id_book) => {
  try {
    const res = await axios.delete(
      API_URL + `/v1/selling_e_books/account/${id_account}/cart`,
      {
        data: {
          account: id_account,
          book: id_book,
          deleteBook: false
        }
      }
    )
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const increaseCart = async data => {
  // console.log(data)
  try {
    await axios.post(
      API_URL + `/v1/selling_e_books/account/${data.account}/cart`,
      data
    )
    // console.log(res.data)
    // return res.data
  } catch (error) {
    console.log(error)
  }
}

//Order manage api
export const getOrders = async (page, sorter, filter) => {
  try {
    const queryObj = {}
    if (page) queryObj.page = page
    if (sorter && sorter.field && sorter.order) {
      const fields = [].concat(sorter.field)
      queryObj.sorterField = fields[0]
      queryObj.sorterOrder = sorter.order == 'ascend' ? 1 : -1
    }
    const propNames = Object.getOwnPropertyNames(filter)
    propNames.forEach(prop => {
      if (filter[prop] != undefined) queryObj[prop] = filter[prop]
    })

    const queryString = new URLSearchParams(queryObj).toString()
    console.log(queryString)
    const res = await axios.get(
      API_URL + '/v1/selling_e_books/order?' + queryString
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getAnonymousOrders = async (page, sorter, filter) => {
  try {
    const queryObj = {}
    if (page) queryObj.page = page
    if (sorter && sorter.field && sorter.order) {
      const fields = [].concat(sorter.field)
      queryObj.sorterField = fields[0]
      queryObj.sorterOrder = sorter.order == 'ascend' ? 1 : -1
    }
    const propNames = Object.getOwnPropertyNames(filter)
    propNames.forEach(prop => {
      if (filter[prop] != undefined) queryObj[prop] = filter[prop]
    })

    const queryString = new URLSearchParams(queryObj).toString()
    const res = await axios.get(
      API_URL + '/v1/selling_e_books/anonymous?' + queryString
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const updateOrder = async order => {
  try {
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/order/' + order._id,
      order
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const updateAnonymousOrder = async order => {
  try {
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/anonymous/' + order._id,
      order
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getShippingInfo = async account => {
  try {
    const address = await axios.get(
      API_URL + `/v1/selling_e_books/account/${account}/shipping`
    )
    console.log(address.data)
    return address.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getVoucher = async (subTotal, voucherCode) => {
  try {
    const address = await axios.post(
      API_URL + `/v1/selling_e_books/voucher/apply`,
      {
        subTotal,
        voucherCode
      }
    )
    console.log('data', address.data)
    return address.data
  } catch (error) {
    return error.response.data
  }
}

export const getShippingCost = async (address, books) => {
  try {
    const response = await axios.post(
      API_URL + `/v1/selling_e_books/shipping/cost`,
      {
        // user: user,
        address: address,
        books: books
      }
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const createNewOrder = async data => {
  try {
    const dataObj = {
      customer: data.customer,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      books: data.books,
      payment: data.payment
    }

    if (data.account) dataObj.account = data.account
    if (data.voucherCode) dataObj.voucherCode = data.voucherCode

    console.log(dataObj)

    const response = await axios.post(
      API_URL + `/v1/selling_e_books/order`,
      dataObj
    )
    return response.data
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const getUserOrders = async (account, status) => {
  try {
    const response = await axios.get(
      API_URL +
        `/v1/selling_e_books/account/${account}/yourOrder${
          status !== 5 ? `?status=${status}` : ''
        }`
    )
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}
export const getAllBookUserBought = async id_account => {
  try {
    const response = await axios.get(
      API_URL + `/v1/selling_e_books/account/${id_account}/bought`
    )
    // console.log('all book user bought : ',response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}
export const getAllBookUserReview = async id_account => {
  try {
    const response = await axios.get(
      API_URL + `/v1/selling_e_books/account/${id_account}/review`
    )
    // console.log('all book user review : ',response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}
export const getReviewOfBook = async id_book => {
  try {
    const response = await axios.get(
      API_URL + `/v1/selling_e_books/review/book/${id_book}`
    )
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}
export const postNewReview = async (id_account, id_book, rating, content) => {
  const reviewInfo = {
    book: id_book,
    account: id_account,
    content: content,
    rating: rating
  }
  // console.log('review info',reviewInfo)
  try {
    const response = await axios.post(API_URL + `/v1/selling_e_books/review/`, {
      book: id_book,
      account: id_account,
      rating: rating,
      content: content
    })
    // console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}
export const updateReview = async (id_account, id_book, rating, content) => {
  const reviewInfo = {
    book: id_book,
    account: id_account,
    content: content,
    rating: rating
  }
  // console.log('review info',reviewInfo)
  try {
    const response = await axios.put(
      API_URL + `/v1/selling_e_books/review/`,
      reviewInfo
    )
    // console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}
export const deleteReview = async (id_account, id_book) => {
  try {
    const res = await axios.delete(API_URL + `/v1/selling_e_books/review/`, {
      data: {
        book: id_book,
        account: id_account
      }
    })
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getTopBook = async (top, field) => {
  try {
    const res = await axios.get(API_URL + `/v1/selling_e_books/book/top/`, {
      params: {
        top: top,
        field: field
      }
    })
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getAllVoucher = async query => {
  try {
    const res = await axios.get(API_URL + `/v1/selling_e_books/voucher`, {
      params: {
        query
      }
    })
    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const createNewVoucher = async voucher => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/voucher`,
      voucher
    )
    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const updateVoucher = async voucher => {
  try {
    const res = await axios.put(
      API_URL + `/v1/selling_e_books/voucher/${voucher._id}`,
      voucher
    )
    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const deleteVoucher = async voucher => {
  try {
    const res = await axios.delete(
      API_URL + `/v1/selling_e_books/voucher/${voucher._id}`
    )
    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const forgotRequest = async email => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/account/forgot`,
      email
    )
    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const confirmVerifyCode = async (email, code) => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/account/forgot/check`,
      {
        email: email,
        code: code
      }
    )

    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const updateNewPassword = async (email, code, password) => {
  try {
    const res = await axios.post(
      API_URL + `/v1/selling_e_books/account/forgot/reset`,
      {
        email: email,
        code: code,
        password: password
      }
    )
    console.log(res.data)
    // console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return {}
  }
}
