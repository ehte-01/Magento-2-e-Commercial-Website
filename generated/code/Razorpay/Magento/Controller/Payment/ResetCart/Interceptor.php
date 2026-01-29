<?php
namespace Razorpay\Magento\Controller\Payment\ResetCart;

/**
 * Interceptor class for @see \Razorpay\Magento\Controller\Payment\ResetCart
 */
class Interceptor extends \Razorpay\Magento\Controller\Payment\ResetCart implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\App\Action\Context $context, \Magento\Customer\Model\Session $customerSession, \Magento\Checkout\Model\Session $checkoutSession, \Razorpay\Magento\Model\CheckoutFactory $checkoutFactory, \Razorpay\Magento\Model\Config $config, \Magento\Catalog\Model\Session $catalogSession, \Psr\Log\LoggerInterface $logger)
    {
        $this->___init();
        parent::__construct($context, $customerSession, $checkoutSession, $checkoutFactory, $config, $catalogSession, $logger);
    }

    /**
     * {@inheritdoc}
     */
    public function execute()
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'execute');
        return $pluginInfo ? $this->___callPlugins('execute', func_get_args(), $pluginInfo) : parent::execute();
    }

    /**
     * {@inheritdoc}
     */
    public function dispatch(\Magento\Framework\App\RequestInterface $request)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'dispatch');
        return $pluginInfo ? $this->___callPlugins('dispatch', func_get_args(), $pluginInfo) : parent::dispatch($request);
    }
}
