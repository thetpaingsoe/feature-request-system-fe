import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { nextTick } from 'vue'

describe('Testing Home View', () => {
  it('testing render properly', () => {
    const wrapper = mount(HomeView, {})

    expect(wrapper.text()).toContain('Time to start your BVI company!')
    expect(wrapper.text()).toContain(
      'All questions below must be answered. Take your time, and if you need to take a break, the form will save automatically and you can continue later. Good luck!',
    )
  })

  it('testing full name blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const fullName = wrapper.get('[data-test="full-name"]')

    await fullName.setValue('')

    await fullName.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Full name is required and "Korporatio" is not allowed.')
  })

  it('testing full name special keyword validation', async () => {
    const wrapper = mount(HomeView, {})

    const fullName = wrapper.get('[data-test="full-name"]')

    await fullName.setValue('korporatio')

    await fullName.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Full name is required and "Korporatio" is not allowed.')
  })

  it('testing email blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const email = wrapper.get('[data-test="email"]')

    await email.setValue('')

    await email.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain(
      'Email is required and must be a valid format. "korporatio@email.com" is not allowed.',
    )
  })

  it('testing email special keyword validation', async () => {
    const wrapper = mount(HomeView, {})

    const email = wrapper.get('[data-test="email"]')

    await email.setValue('korporatio@email.com')

    await email.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain(
      'Email is required and must be a valid format. "korporatio@email.com" is not allowed.',
    )
  })

  it('testing email with wrong format', async () => {
    const wrapper = mount(HomeView, {})

    const email = wrapper.get('[data-test="email"]')

    await email.setValue('korporatio')

    await email.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain(
      'Email is required and must be a valid format. "korporatio@email.com" is not allowed.',
    )
  })

  it('testing company name blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const companyName = wrapper.get('[data-test="company-name"]')

    await companyName.setValue('')

    await companyName.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Company name is required and "Korporatio" is not allowed.')
  })

  it('testing company name special keyword validation', async () => {
    const wrapper = mount(HomeView, {})

    const companyName = wrapper.get('[data-test="company-name"]')

    await companyName.setValue('korporatio')

    await companyName.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Company name is required and "Korporatio" is not allowed.')
  })

  it('testing alt company name blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const altCompanyName = wrapper.get('[data-test="alt-company-name"]')

    await altCompanyName.setValue('')

    await altCompanyName.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain(
      'Alternative Company name is required and cannot be same with company name.',
    )
  })

  it('testing alt company name with same company name', async () => {
    const wrapper = mount(HomeView, {})

    const companyName = wrapper.get('[data-test="company-name"]')

    await companyName.setValue('korporatio')

    const altCompanyName = wrapper.get('[data-test="alt-company-name"]')

    await altCompanyName.setValue('korporatio')

    await altCompanyName.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain(
      'Alternative Company name is required and cannot be same with company name.',
    )
  })

  it('testing alt company designation blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const companyDesignationDropdown = wrapper.get('[data-test="company-designation"]')

    await companyDesignationDropdown.trigger('click')
    await nextTick()

    const options = wrapper.findAll('li')

    await options[0].trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Please select a designation from the list.')
  })

  it('testing alt company designation valid selection', async () => {
    const wrapper = mount(HomeView, {})

    const companyDesignationDropdown = wrapper.get('[data-test="company-designation"]')

    await companyDesignationDropdown.trigger('click')
    await nextTick()

    const options = wrapper.findAll('li')

    await options[1].trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Chief Executive Officer')
    expect(wrapper.text()).not.toContain('Please select a designation from the list.')
  })

  it('testing Jurisdiction of operation blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const operationCountryDropdown = wrapper.get('[data-test="operation-country"]')

    await operationCountryDropdown.trigger('click')
    await nextTick()

    const options = wrapper.findAll('li')

    await options[0].trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Please select a operation country from the list.')
  })

  it('testing Jurisdiction of operation valid', async () => {
    const wrapper = mount(HomeView, {})

    const operationCountryDropdown = wrapper.get('[data-test="operation-country"]')

    await operationCountryDropdown.trigger('click')
    await nextTick()

    const options = wrapper.findAll('li')

    await options[1].trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Singapore')
    expect(wrapper.text()).not.toContain('Please select a operation country from the list.')
  })

  it('testing Target Jurisdictions blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const operationCountryDropdown = wrapper.get('[data-test="target-country"]')

    await operationCountryDropdown.trigger('click')
    await nextTick()
    await operationCountryDropdown.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Please select 1 to 3 target jurisdictions')
  })

  it('testing Jurisdiction of operation valid selection', async () => {
    const wrapper = mount(HomeView, {})

    const operationCountryDropdown = wrapper.get('[data-test="target-country"]')

    await operationCountryDropdown.trigger('click')
    await nextTick()

    const options = wrapper.findAll('li')

    await options[0].trigger('click')
    await nextTick()
    await options[1].trigger('click')
    await nextTick()
    await options[2].trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Singapore')
    expect(wrapper.text()).not.toContain('Please select 1 to 3 target jurisdictions')
  })

  it('testing num of shares blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const numOfSharesInput = wrapper.get('[data-test="num-of-shares"]')

    await numOfSharesInput.setValue('')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Please enter number of shares at least 1 share.')
  })

  it('testing num of shares with special chars', async () => {
    const wrapper = mount(HomeView, {})

    const numOfSharesInput = wrapper.get('[data-test="num-of-shares"]')

    await numOfSharesInput.setValue('Abc123')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    expect(numOfSharesInput.element.value).toBe('123')

    await numOfSharesInput.setValue('ABC')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    expect(numOfSharesInput.element.value).toBe('')
  })

  it('testing issued shares blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const issuedShares = wrapper.get('[data-test="issued-shares"]')

    await issuedShares.setValue('')

    await issuedShares.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Please input the valid issued shares.')
  })

  it('testing issued shares that is larger than num of shares', async () => {
    const wrapper = mount(HomeView, {})

    const numOfSharesInput = wrapper.get('[data-test="num-of-shares"]')

    await numOfSharesInput.setValue('100')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    const issuedShares = wrapper.get('[data-test="issued-shares"]')

    await issuedShares.setValue('150')

    await issuedShares.trigger('blur')

    await nextTick()

    expect(wrapper.text()).toContain('Please input the valid issued shares.')
  })

  it('testing are all shares issued blank validation', async () => {
    const wrapper = mount(HomeView, {})

    const nextButton = wrapper.find('#nextForm')

    await nextButton.trigger('click')

    await nextTick()

    expect(wrapper.text()).toContain('Please choose Yes or No.')
  })

  it('testing are all shares issued with valid selection.', async () => {
    const wrapper = mount(HomeView, {})

    const radioGroup = wrapper.get('[data-test="are-all-shared-issued"]')

    const options = radioGroup.findAll('input[type="radio"]')

    await options[0].setValue()
    await nextTick()

    const nextButton = wrapper.find('#nextForm')

    await nextButton.trigger('click')

    await nextTick()

    expect(wrapper.text()).not.toContain('Please choose Yes or No.')
  })

  it('testing are all shares are issued, issued shared will be cannot update and set auto num.', async () => {
    const wrapper = mount(HomeView, {})

    const radioGroup = wrapper.get('[data-test="are-all-shared-issued"]')

    const options = radioGroup.findAll('input[type="radio"]')

    await options[0].setValue()
    await nextTick()

    const numOfSharesInput = wrapper.get('[data-test="num-of-shares"]')

    await numOfSharesInput.setValue('100')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    const issuedShares = wrapper.get('[data-test="issued-shares"]')

    expect(issuedShares.element.value).toBe('100')
  })

  it('testing are all shares are issued, but num of shares and issued shares are same.', async () => {
    const wrapper = mount(HomeView, {})

    const radioGroup = wrapper.get('[data-test="are-all-shared-issued"]')

    const options = radioGroup.findAll('input[type="radio"]')

    await options[0].setValue()
    await nextTick()

    const numOfSharesInput = wrapper.get('[data-test="num-of-shares"]')

    await numOfSharesInput.setValue('100')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    const issuedShares = wrapper.get('[data-test="issued-shares"]')

    await issuedShares.setValue('100')

    await issuedShares.trigger('blur')

    await nextTick()

    expect(wrapper.text()).not.toContain('Please input the valid issued shares.')
  })

  it('testing all shares are not issue, and num of shares and issued shares are not same.', async () => {
    const wrapper = mount(HomeView, {})

    const radioGroup = wrapper.get('[data-test="are-all-shared-issued"]')

    const options = radioGroup.findAll('input[type="radio"]')

    await options[1].setValue()
    await nextTick()

    const numOfSharesInput = wrapper.get('[data-test="num-of-shares"]')

    await numOfSharesInput.setValue('100')

    await numOfSharesInput.trigger('blur')

    await nextTick()

    const issuedShares = wrapper.get('[data-test="issued-shares"]')

    await issuedShares.setValue('80')

    await issuedShares.trigger('blur')

    await nextTick()

    expect(wrapper.text()).not.toContain('Please input the valid issued shares.')
  })
})
